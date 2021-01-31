# Obsidian todo.txt Kanban plugin

## Introduction

This is a plugin of Obsidian.md that integrates todo.txt and a Kanban representation of tasks per project.

This is not a Kanban board like Trello or Jira. Each project gets a Markdown file with the Kanban statuses: Backlog, In Progress, Done.

> Disclaimer: As of 2021-01-31 this repo is NOT production ready. Use at your own risk. If the vault with your life's work gets wrecked by this, then I'll be sad, but I won't be responsible.

The epic I'm working against is:
> As a productivity freak that uses todo.txt for tasks and Obsidian as a second brain I want to keep my tasks in todo.txt list but be able to manage my separate projects using a Kanban-type process in Obsidian. 



## Prerequisites
- A willingness to assume the risk of using crappy software within your Obsidian vault.
- A willingness to manage tasks in todo.txt and kanban-like reports
- todo.txt CLI installed (https://github.com/todotxt/todo.txt-cli)
- tkb wrappers for todo.txt CLI (https://github.com/brosell/todotxt-kanban)
	- This plugin works with some extensions built on top todo.txt CLI. That is a separate repo that I am maintaining. This plugin is useless without also having those addons for todo.txt CLI. That project is completely usable outside of this Obsidian Usecase
- Obsidian.md (http://obsidian.md)
- I use VSCODE and WSL and these instructions assume you are familiar with those or similar environments!

## Cautions
- DON'T TEST THIS ON YOUR ONLY COPY OF YOUR LIFE'S WORK!!
- This plugin shell execs `wsl.exe` in several places. If that makes you nervous then step away.

## HOWTO to install
> These steps probably work, but not really tested from _your_ POV
- clone this repo
- create a vault in Obsidian for testing. DON'T TEST THIS ON YOUR ONLY COPY OF YOUR LIFE'S WORK!!
- PREPARE (one time)
	- `mkdir -p /path/to/my/TestVault/.obsidian/plugins/todotxt-kanban`
	- update `rollup.config.js` so that `output.dir` points to `/path/to/my/TestVault/.obsidian/plugins/todotxt-kanban`.
		- This is OPTIONAL and helps to skip a step of copying the required files over every time
	- `npm install`
	- `npm run build`
	- `cp main.js style.css manifest.json /path/to/my/TestVault/.obsidian/plugins/todotxt-kanban`
- If your here just to test this this then stop here and move on to the Usage section.
- MAKING and TESTING changes
	- `npm run dev`
		- this'll watch for changes and rebuild on demand


## Usage

**Usage Recommendation** Don't. This will probably eat your life's work if tested in an actual Obsidian vault.

**If that advice is ignored**
see https://github.com/brosell/todotxt-kanban for details on how `tkb` tools manipulate todo.txt tasks

Setup `tkb.cfg` to point to your todo list. I keep mine in my obsidian vault, but that isn't a requirement.

Once setup you can use `tkb` as you would `todo.sh` to add and manipulate tasks. You don't _have_ to use `tkb` for non-kanban operations, but make sure that your `todo.cfg` and the `tkb.cfg` are compatible.

There are several commands added to the command pallet (crtl-p). They prefixed with todo.txt KanBan.
- Move to Backlog
- Move to In Progress
- Move to Done

Currently there is flux in the requirements around how to treat kanban-done vs todo.txt done status. Right now, kanban done != todo.txt done, so a separate step is needed to clear @done tasks.


## Todo
> Disclaimer: This isn't a commitment. I'm building and updating this based on my workflow. I'm happy to accept pull requests that make sense to me and fulfill any of these or other open items.
- [ ] clean up the code
- [ ] complete the `add Todo` command - need to learn
- [ ] to many hardcoded things. Add configuration options
- [ ] set @Done tasks as completed in todo.txt, but leave in todo.txt until removed somehow (Remove done feature, manually, etc.). This'll make it compatible with reporting tools like 'Standup' or other done.txt and date reports. (I suppose `tkb-gen` can use the done.txt for loading Done tasks too. All this thinking has made me wonder if tkb needs a forth status of `validation` before setting to done in todo.txt...)
- [ ] publish the Kanban for this project into the repo instead of maintaining this todo list.
	- Maybe just transclude right into this file?
	- depends on the stability of tkb project and this before I use it with my life's work vault.

## Changelog
### 2021-01-31 - initial prototype garbage code
#### Features
- can manipulate the kanban status of tasks using commands/hotkeys
- see tkb for details on the todo.txt kanban process I use.
#### Bugs
- yes there are

## Acknowledgments
This started life at the sample plugin implementation for Obsidian.
- https://obsidian.md
- https://github.com/obsidianmd/obsidian-api
- https://github.com/obsidianmd/obsidian-sample-plugin
- Looked at several community plugins for coding examples in particular
    - https://github.com/DahaWong/obsidian-completed-area
    - https://github.com/hans/obsidian-citation-plugin
    - https://github.com/SilentVoid13/Templater
> Note: please make no assmptions about the quality of the code in those repos based on the garbage in this repo. Those are great projects; this is a WIP.
- The OMG Discord plugin channel


### Original Sample Plugin README.md 
> with embellishments by brosell. I plan to contribute my notes about workflow back to that project _later_.

--- 
This project uses Typescript to provide type checking and documentation.
The repo depends on the latest plugin API (obsidian.d.ts) in Typescript Definition format, which contains TSDoc comments describing what it does.

**Note:** The Obsidian API is still in early alpha and is subject to change at any time!

This sample plugin demonstrates some of the basic functionality the plugin API can do.
- Changes the default font color to red using `styles.css`.
- Adds a ribbon icon, which shows a Notice when clicked.
- Adds a command "Open Sample Modal" which opens a Modal.
- Adds a plugin setting tab to the settings page.
- Registers a global click event and output 'click' to the console.
- Registers a global interval which logs 'setInterval' to the console.


### Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments.
- Publish the release.

### Adding your plugin to the community plugin list

- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

### How to use

- Clone this repo. (or use it as a template for your own repo, then clone that)
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.

### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.
> `your-plugin-id` is a string like 'todotxt-kanban'

### Or let it be built right into your plugin folder

by changing the rollup.config.js
```
dir: '/mnt/c/projects/KBT_Test/.obsidian/plugins/todotxt-kanban'
```

### API Documentation

See https://github.com/obsidianmd/obsidian-api
