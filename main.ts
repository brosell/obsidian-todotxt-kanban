import { App, FuzzyMatch, FuzzySuggestModal, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { exec } from "child_process";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	statusBar: any;

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();

		// this.addRibbonIcon('dice', 'Sample Plugin', () => {
		// 	// new Notice('This is a notice!');
		// 	this.editSource();
		// });

		this.statusBar = this.addStatusBarItem();
		// @ts-ignore
		window["tkb"] = this;

		this.addCommand( {id: 'todotxt-kanban-inprogress',
			name: 'Move To In Progress', 
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						this.changeTaskUnderCursorStatus("inprogress");
					}
					return true;
				}
				return false;
			}
		});

		this.addCommand({ id: 'todotxt-kanban-done',
			name: 'Move To Done', 
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						this.changeTaskUnderCursorStatus("done");
					}
					return true;
				}
				return false;
			}
		});

		this.addCommand({ id: 'todotxt-kanban-backlog',
			name: 'Move To Backlog', 
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						this.changeTaskUnderCursorStatus("");
					}
					return true;
				}
				return false;
			}
		});

		this.addCommand({ id: 'todotxt-kanban-archive',
			name: 'Archive Done to remove from Kanban', 
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						this.markComplete();
					}
					return true;
				}
				return false;
			}
		});

		// this.addCommand({ id: 'todotxt-kanban-add',
		// 	name: 'New Todo', 
		// 	checkCallback: (checking: boolean) => {
		// 		let leaf = this.app.workspace.activeLeaf;
		// 		if (leaf) {
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}
		// 			return true;
		// 		}
		// 		return false;
		// 	}
		// });

		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			console.log('codemirror', cm);
		});

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	taskRegExp = /^-\s(\d+)\s+.+$/; // dash space number space the rest of the task
	
	getProjectName(sourceEditor: CodeMirror.Editor) : string {
		let firstLine = sourceEditor.getLine(0);
		return firstLine.substring(2);
	}

	isTask(taskLine: string) : boolean{
		return !!taskLine.match(this.taskRegExp);
	}

	getStatusFromTaskLinePosition(sourceEditor: CodeMirror.Editor, lineNumber:number) : string {
		const statusHeaderTest = /## ((Backlog)|(In Progress)|(Done))/
		while(lineNumber-- >= 0) {
			const line = sourceEditor.getLine(lineNumber);
			const match = line.match(statusHeaderTest);
			if (match) {
				return match[1];
			} 
		}
		return null;
	}

	getSelectedTask() : any {
		const activeLeaf = this.app.workspace.activeLeaf ?? null;
		let sourceText = "";
		let answer = { line:"", taskNumber:"", projectName:"", status: 'notfound' };
		if (activeLeaf) {
			//@ts-ignore
			const source = activeLeaf.view.sourceMode;
			const editor = source.cmEditor;
			const cursorPos = editor.getCursor()
			let searchLine = cursorPos.line;
			
			if (searchLine) {
				sourceText = editor.getLine(searchLine);
				let matches = sourceText.match(this.taskRegExp);

				if (!matches) {
					return false;
				}

				answer = {
					line: sourceText,
					taskNumber: matches[1], 
					projectName: this.getProjectName(editor), 
					status: this.getStatusFromTaskLinePosition(editor, cursorPos.line)
				};
				return answer;
			}
			
		}
		return false;
	}

	changeTaskUnderCursorStatus(status: string) {
		new Notice(`updating`);
		this.statusBar.setText()
		let task = this.getSelectedTask();
		let statusDisp = status || 'Backlog';

		if (task) {
			this.statusBar.setText(`${task.projectName} ${task.taskNumber} ${task.status} -> ${statusDisp}`)
			this.setStatus(task.taskNumber, status);
		}
	}

	setStatus(taskNumber: string, status: string) {
		// tkb-status 08 done
		this.execTkb(`-status ${taskNumber} ${status}`, (stdoutResult:string) => {
			this.statusBar.setText();
		});
	}

	markComplete() {
		let task = this.getSelectedTask();
		if (task) {
			this.execTkb(` do ${task.taskNumber}`, (stdoutResult:string) => {
				this.execTkb(`-gen +${task.projectName}`, (stdoutResult:string) => {
					// nada
				});
			});
		}
	}

	tkbPath="/home/bert/todo.txt-kanban/bin";

	execTkb(args:string, callback:any)  {
		exec(`wsl --exec ${this.tkbPath}/tkb${args}`, (error, stdout, stderr) => {
			if (this.wasExecError(error, stdout, stderr)) { return }
			callback(stdout);
		});
	}

	wasExecError(error:any, stdout:string, stderr:string) :boolean {
		if (error) {
			new Notice(`error: ${error.message}`);
			console.log(`error: ${error.message}`);
			return true;
		}
		if (stderr) {
			new Notice(`stderr: ${stderr}`);
			console.log(`stderr: ${stderr}`);
			return true;
		}
		new Notice(stdout);
		return false;
	}
}

class SampleModal extends FuzzySuggestModal<string> {
	getItems(): string[] {
		return [];
	}
	getItemText(item: string): string {
		console.log(item);
		return item;
	}
	onChooseItem(item: string, evt: MouseEvent | KeyboardEvent): void {
		console.log(item);
	}

	onChooseSuggestion(item: FuzzyMatch<string>, evt: MouseEvent | KeyboardEvent): void {
		console.log(item.item, item.match);
	}

	constructor(app: App) {
		super(app);

		this.setInstructions([
			// { command: '↑↓', purpose: 'to navigate' },
			{ command: '↵', purpose: 'add' },
			{ command: 'ctrl ↵', purpose: 'add and go' },
			// { command: 'tab', purpose: 'open in Zotero' },
			// { command: 'shift tab', purpose: 'open PDF' },
			{ command: 'esc', purpose: 'to dismiss' },
		  ]);
	}

	onOpen() {
		// let {contentEl} = this;
		// contentEl.setText('lolol!');
		// //contentEl.createEl('input', {text: 'Settings for my awesome plugin.', attr: { "onchange": "alert('what?');"}});
		// new Setting(contentEl)
		// 	.setName('I just got a new Todo')
		// 	.setDesc('Enter the task, use +project and/or @contexts')
		// 	.addText(text => text
		// 		.setPlaceholder('Todo')
		// 		.setValue('')
		// 		.onChange(async (value) => {
		// 			console.log('New Task: ' + value);
		// 		});

		// 		text.inputEl.onkeypress
				
		// 		);
	// 	new Setting(contentEl)
	// 		.setName('Submit')
	// 		.addButton(btn => btn
	// 			.onClick()
	// 			)
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting || '')
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
