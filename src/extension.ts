import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import axios from 'axios';

const LM_STUDIO_URL = 'http://127.0.0.1:1234/v1/completions';

async function generateDescription(code: string): Promise<string> {

    const selectedModel = vscode.workspace.getConfiguration('zxObsidianNoteAI').get<string>('LMApiModel') || "deepseek-r1-distill-qwen-7b";
    const customPrompt = vscode.workspace.getConfiguration('zxObsidianNoteAI').get<string>('Prompt') ||
        "Analise e explique de forma clara e resumida, em português, o que o seguinte trecho de código faz. Destaque as funcionalidades principais, lógica implementada e propósito geral.";
    try {
        const response = await axios.post(LM_STUDIO_URL, {
            model: selectedModel,
            prompt: `${customPrompt}:\n\n${code}\n\n`,
        });

        if (response.data.choices && response.data.choices.length > 0) {

            let result = response.data.choices[0].text.trim();

            // Remove linhas de pensamento da IA
            
            const thinkIndex = result.indexOf("</think>");
            if (thinkIndex !== -1) {
                result = result.substring(thinkIndex + 8).trim();
            }

            return result || "Descrição não gerada.";

        } else {
            return "Nenhuma descrição foi gerada pelo modelo.";
        }
    } catch (error) {
        return "Erro ao conectar com o LM Studio. Verifique se o servidor está em execução.";
    }
}


export async function activate(context: vscode.ExtensionContext) {
    let saveSelection = vscode.commands.registerCommand('extension.saveSelection', async () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const selection = editor.selection;
            let text = editor.document.getText(selection);

            if (!text) {
                vscode.window.showWarningMessage("Selecione um texto antes de salvar.");
                return;
            }

            const description = await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Gerando descrição do código usando LM Studio...",
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0 });
                const result = await generateDescription(text);
                progress.report({ increment: 100 });
                return result;
            });

            const vaultPath = vscode.workspace.getConfiguration('zxObsidianNoteAI').get<string>('vaultPath');
            if (!vaultPath) {
                vscode.window.showErrorMessage("Caminho do Obsidian não configurado. Adicione o caminho nas configurações da extensão.");
                return;
            }

            const fileName = editor.document.fileName;
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri.fsPath || "Workspace Desconhecido";

            let repoName = "Repositório Desconhecido";

            try {
                const repoPath = child_process.execSync('git rev-parse --show-toplevel', { cwd: workspaceFolder }).toString().trim();
                repoName = path.basename(repoPath);
            } catch (error) {
                console.log("Não foi possível encontrar o repositório Git. Talvez o arquivo não esteja em um repositório.");
            }

            const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
            const noteFileName = `Snippet-${dateStr}.md`;
            const filePath = path.join(vaultPath, noteFileName);

            const formattedText = `# 🚀 VS Code Snippet - ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}\n\n`
                + `- **🗃 Arquivo:** ${fileName}\n`
                + `- **📂 Repositório:** ${repoName}\n`
                + `- **📁 Workspace:** ${workspaceFolder}\n`
                + `--- \n \n`
                + `## 💬 Descrição do Código \n \n`
                + `${description} \n \n`
                + `## 📄 Código \n \n`
                + `\`\`\`\n${text}\n\`\`\`\n\n`;

            try {
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
                fs.writeFileSync(filePath, formattedText);
                vscode.window.showInformationMessage(`Seleção salva com sucesso no Obsidian como "${noteFileName}"!`);
            } catch (error) {
                vscode.window.showErrorMessage("Erro ao salvar a seleção: " + (error as Error).message);
            }
        }
    });

    context.subscriptions.push(saveSelection);
}

export function deactivate() { }
