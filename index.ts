import axios from 'axios';
import * as vscode from 'vscode';

async function translateText(text: string): Promise<string | null> {
  const apiKey = 'a3dc66c5a81253a7e5cf';
  const url = 'https://api.mymemory.translated.net/get';

  try {
    const response = await axios.get(url, {
      params: {
        q: text,
        langpair: 'fr|en',
        key: apiKey
      }
    });

    return response.data.responseData.translatedText;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function translateCommentedLines(): void {
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor) {
    const { document } = activeTextEditor;
    const { lineCount } = document;

    for (let line = 0; line < lineCount; line++) {
      const lineText = document.lineAt(line).text;

      // Vérifier si la ligne est un commentaire
      if (lineText.trim().startsWith('//')) {
        const textToTranslate = lineText.substring(2).trim();
        translateText(textToTranslate)
          .then(translation => {
            // Remplacer la ligne avec la traduction
            if (translation) {
              const range = new vscode.Range(line, 0, line, lineText.length);
              activeTextEditor.edit((editBuilder) => {
                editBuilder.replace(range, `// ${translation}`);
              });
            }
          })
          .catch(error => {
            console.error('Erreur lors de la traduction :', error);
          });
      }
    }
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('extension.translateCommentedLines', translateCommentedLines);
  context.subscriptions.push(disposable);
}
