import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { Analyzer } from './analyzer';
import { dirfuncs } from './dirfuncs';
import { JsonState } from './jsonState';

export let visualText: VisualText;
export class VisualText {
    _ctx: vscode.ExtensionContext;

    public analyzer = new Analyzer();
    private jsonState = new JsonState();

    private analyzers: vscode.Uri[] = new Array();
    private engineDir: vscode.Uri = vscode.Uri.file('');
    private analyzerDir: vscode.Uri = vscode.Uri.file('');
    private currentAnalyzer: vscode.Uri = vscode.Uri.file('');
    private workspaceFold: vscode.WorkspaceFolder | undefined = undefined;

	constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
    }
    
    static attach(ctx: vscode.ExtensionContext): VisualText {
        if (!visualText) {
            visualText = new VisualText(ctx);
            if (vscode.workspace.workspaceFolders) {
                visualText.workspaceFold = vscode.workspace.workspaceFolders.filter(folder => folder.uri.scheme === 'file')[0];
                if (visualText.workspaceFold) {
                    visualText.readState();
                    visualText.getAnalyzers();
                    visualText.initSettings();
                }
            }
        }
        return visualText;
    }

	readState(): boolean {
        if (this.workspaceFold) {
            this.analyzerDir = this.workspaceFold.uri;
            if (this.jsonState.jsonParse(this.analyzerDir,'state','visualText')) {
                var saveit = false;
                var parse = this.jsonState.json.visualText[0];
                var currAnalyzer = parse.currentAnalyzer;

                if (currAnalyzer.length == 0) {
                    var analyzers = dirfuncs.getDirectories(this.workspaceFold.uri);
                    currAnalyzer = analyzers[0].fsPath;
                    saveit = true;
                }

                if (currAnalyzer) {
                    if (fs.existsSync(currAnalyzer))
                        this.currentAnalyzer = vscode.Uri.file(currAnalyzer);
                    else
                        this.currentAnalyzer = vscode.Uri.file(path.join(this.analyzerDir.fsPath,currAnalyzer));

                    if (parse.engineDir) {
                        if (parse.engineDir.length > 1) {
                            this.engineDir = vscode.Uri.file(path.join(parse.engineDir));
                        } else {
                            this.findEngine();
                            saveit = true;
                        }                        
                    }

                    if (saveit)
                        this.saveCurrentAnalyzer(this.analyzerDir);
                    this.loadAnalyzer(this.currentAnalyzer);
                    return true;
                }
            } else {
                this.saveCurrentAnalyzer(this.analyzerDir);
            }
        }
        return false;
    }

    initSettings(): boolean {
        var fromDir = this.getVisualTextDirectory('.vscode');
        if (fs.existsSync(fromDir)) {
            var toDir = path.join(this.analyzerDir.fsPath,'.vscode');
            if (!fs.existsSync(toDir)) {
                if (!dirfuncs.copyDirectory(fromDir,toDir)) {
                    vscode.window.showWarningMessage('Copy settings file failed');
                    return false;
                }
                return true;           
            }
            this.ensureExists('settings.json',toDir,fromDir);
            this.ensureExists('state.json',toDir,fromDir);
        }
        return false;
    }

    ensureExists(fileName: string, toDir: string, fromDir: string) {
        var toFile = path.join(toDir,fileName);
        if (!fs.existsSync(toFile)) {
            var fromFile = path.join(fromDir,fileName);
           fs.copyFileSync(fromFile,toFile);
        }   
    }

    findEngine() {
        if (this.getEngineDirectory().fsPath.length < 2) {
            this.engineDir = dirfuncs.findFolder(this.getWorkspaceFolder(),'nlp-engine');
        }
    }

    saveCurrentAnalyzer(currentAnalyzer: vscode.Uri) {
        this.findEngine();
        var stateJsonDefault: any = {
            "visualText": [
                {
                    "name": "Analyzer",
                    "type": "state",
                    "engineDir": this.getEngineDirectory().fsPath,
                    "currentAnalyzer": currentAnalyzer.fsPath   
                }
            ]
        }
        this.jsonState.saveFile(this.analyzerDir.fsPath, 'state', stateJsonDefault);
        this.setCurrentAnalyzer(currentAnalyzer);       
    }

    loadAnalyzer(analyzerDirectory: vscode.Uri) {
        this.saveCurrentAnalyzer(analyzerDirectory);
        this.analyzer.load(analyzerDirectory);
        vscode.commands.executeCommand('textView.refreshAll');
        vscode.commands.executeCommand('sequenceView.refreshAll');
        vscode.commands.executeCommand('outputView.refreshAll');
    }

    setCurrentAnalyzer(currentAnalyzer: vscode.Uri) {
        if (this.jsonState.json) {
            var parse = this.jsonState.json.visualText[0];
            parse.currentAnalyzer = currentAnalyzer.fsPath;
            this.jsonState.writeFile();
        }
    }

    getAnalyzer(): vscode.Uri {
        return this.currentAnalyzer;
    }
    
    getEngineDirectory() {
        return this.engineDir;
    }

    hasAnalyzers(): boolean {
        var i = 0;
        return this.analyzers.length ? true : false;
    }

    getAnalyzers(): vscode.Uri[] {
        if (this.analyzerDir.fsPath.length) {
            this.analyzers = [];
            this.analyzers = dirfuncs.getDirectories(this.analyzerDir);
        }
        return this.analyzers;
    }

	hasWorkspaceFolder(): boolean {
		return this.workspaceFold?.uri.fsPath.length ? true : false;
	}

	getWorkspaceFolder(): vscode.Uri {
        if (this.workspaceFold) {
		    return this.workspaceFold.uri;            
        }
        return vscode.Uri.file('');
    }

    visualTextDirectoryExists(): boolean {
        return fs.existsSync(this.getVisualTextDirectory());
    }

    getVisualTextDirectory(dirName: string=''): string {
        if (dirName.length)
            return path.join(this.getEngineDirectory().fsPath,'visualtext',dirName);
        else
            return path.join(this.getEngineDirectory().fsPath,'visualtext');
    }
}