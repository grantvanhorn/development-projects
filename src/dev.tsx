import {
  ActionPanel,
  Color,
  Detail,
  getPreferenceValues,
  List,
  OpenAction,
} from '@raycast/api';
import {
  readdirSync,
  readFileSync,
} from 'fs';
import React from 'react';
import { ProjectInterface } from './types';

const ignoreList = [
  '.DS_Store',
];

const checkForPackageJSON = (devDirPath: string, dir: string) => {
  try {
    const jsonRaw = readFileSync(`${devDirPath}/${dir}/package.json`);
    const json = JSON.parse(jsonRaw);

    return json;
  } catch (e) {
    return null;
  }
}

const pickIcon = (packageJSON) => {
  const raw = JSON.stringify(packageJSON);
  console.log(raw);

  if (raw.includes('next')) {
    return 'nextjs.png';
  }

  if (raw.includes('react')) {
    return 'react.png';
  }

  return 'nodejs.png';
}

const Dev = () => {
  const preferences = getPreferenceValues();
  const {
    devDir,
  } = preferences;
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
      icon={{ source: icon }}
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
