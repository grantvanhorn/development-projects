import {
  ActionPanel,
  getPreferenceValues,
  List,
  OpenAction,
  Icon,
} from '@raycast/api';
import {
  readdirSync,
  readFileSync,
} from 'fs';
import {
  ProjectInterface,
  PackageJSONInterface,
  PreferencesInterface,
} from './types';

const ignoreList: Array<string> = [
  '.DS_Store',
];

const checkForPackageJSON = (devDirPath: string, dir: string) => {
  try {
    const jsonRaw: string = readFileSync(`${devDirPath}/${dir}/package.json`).toString();
    return JSON.parse(jsonRaw);
  } catch (e) {
    return null;
  }
}

const pickIcon = (packageJSON: PackageJSONInterface) => {
  const raw = JSON.stringify(packageJSON);

  if (raw.includes('next')) {
    return 'nextjs.png';
  }

  if (raw.includes('react')) {
    return 'react.png';
  }

  return 'nodejs.png';
}

const getDevDirProjects = (devDir: string): Array<string> => {
  const projectDirs: Array<string> = readdirSync(devDir);
  const filteredProjectDirs: Array<string> = projectDirs.filter((dir: string) => !ignoreList.includes(dir));
  return filteredProjectDirs;
};

const createConfigForAllProjects = (devDir: string, projectDirs: Array<string>): Array<ProjectInterface> => {
  const projects: Array<ProjectInterface> = projectDirs.map((dir: string) => {


    return {
      name: dir,
      description: '',
      icon: '',
      target: `${devDir}/${dir}`,
    }
  });

  return projects;
};

const Dev = () => {
  const {
    devDir,
  }: PreferencesInterface = getPreferenceValues();

  const projects: Array<ProjectInterface> = readdirSync(devDir).filter((dir: string) => !ignoreList.includes(dir)).map((dir: string) => {
    const projectInfo = {
      name: dir,
      description: '',
      icon: '',
      target: `${devDir}/${dir}`,
    };

    const packageJSON = checkForPackageJSON(devDir, dir);

    if (packageJSON) {
      if (packageJSON.title) {
        projectInfo.name = packageJSON.title;
      }
      projectInfo.description = packageJSON.description ? packageJSON.description : '';
      projectInfo.icon = pickIcon(packageJSON);
    }

    return projectInfo;
  });

  return <List>
    {projects.map(({name, description, icon, target}) => (
    <List.Item
      key={name}
      icon={icon.length > 0 ? { source: icon } : Icon.Terminal}
      title={name}
      accessoryTitle={description}
      actions={<ActionPanel>
        <OpenAction
          title="Open project in VSCode"
          icon="command-icon.png"
          target={target}
          application="Visual Studio Code"
        />
        <OpenAction
          title="Open Hyper at this projects path"
          icon="command-icon.png"
          target={target}
          application="Hyper"
        />
      </ActionPanel>}
    />))}
  </List>;
};

export default Dev;
