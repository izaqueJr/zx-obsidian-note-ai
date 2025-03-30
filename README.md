# ZX - Obsidian Note AI

📖 Sobre a Extensão

ZX - Obsidian Note AI é uma extensão para o VS Code que permite salvar snippets de código diretamente no Obsidian, com explicações automáticas geradas por IA. Ideal para desenvolvedores que utilizam o Obsidian como um "segundo cérebro" e querem documentar seus projetos de forma prática e eficiente.

✨ Funcionalidades

✅ Salvar snippets de código no Obsidian com explicações automáticas geradas por IA.

✅ Suporte a diferentes modelos de IA, configuráveis no settings.json do VS Code.

✅ Prompt Personalizável: Permite definir o prompt enviado para o modelo de IA.

✅ Compatível com Obsidian, armazenando notas em arquivos Markdown organizados.

✅ Uso de inteligência artificial para gerar descrições automáticas de códigos em português.

⚙️ Requisitos

Visual Studio Code (versão mínima: 1.70.0)

Obsidian instalado e configurado.

LM Studio rodando na rede http://127.0.0.1:1234

Modelo configurado: deepseek-r1-distill-qwen-7b


⚙️ Configuração

Exemplo de configuração do settings.json do VS Code, altere as informações de acordo com o seu uso:

{
    "zxObsidianNoteAI.vaultPath": "C:\\Users\\SeuUsuario\\Obsidian\\SecondBrain\\Notes",
    "zxObsidianNoteAI.LMApiModel": "deepseek-r1-distill-qwen-7b",
    "zxObsidianNoteAI.Prompt": "Explique resumidamente e em português o que o seguinte código faz: "
}

🖱️ Como Usar

Selecione o código que deseja salvar no Obsidian.

Use o atalho padrão Ctrl+Alt+S ou execute o comando Salvar Seleção no Obsidian através da Command Palette (Ctrl+Shift+P).

A nota será salva na pasta configurada no Obsidian com a descrição gerada pela IA.

Desenvolvido por Izaque Rodrigues 

Github: https://github.com/izaqueJr

📜 Licença

MIT License

