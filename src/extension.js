"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function activate(context) {
    let saveSelection = vscode.commands.registerCommand('extension.saveSelection', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            if (!text) {
                vscode.window.showWarningMessage("Selecione um texto antes de salvar.");
                return;
            }
            const userHome = process.env.HOME || process.env.USERPROFILE;
            const obsidianPath = path.join(userHome || '', 'Obsidian', 'SecondBrain', 'Notes', 'VSCode.md');
            const formattedText = `### ${new Date().toLocaleString()}\n\n\`\`\`\n${text}\n\`\`\`\n\n---\n`;
            try {
                fs.appendFileSync(obsidianPath, formattedText);
                vscode.window.showInformationMessage("Seleção salva com sucesso no Obsidian!");
            }
            catch (error) {
                vscode.window.showErrorMessage("Erro ao salvar a seleção: " + error.message);
            }
        }
    });
    context.subscriptions.push(saveSelection);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map