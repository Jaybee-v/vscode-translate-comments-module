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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const axios_1 = __importDefault(require("axios"));
const vscode = __importStar(require("vscode"));
function translateText(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = 'a3dc66c5a81253a7e5cf';
        const url = 'https://api.mymemory.translated.net/get';
        try {
            const response = yield axios_1.default.get(url, {
                params: {
                    q: text,
                    langpair: 'fr|en',
                    key: apiKey
                }
            });
            return response.data.responseData.translatedText;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    });
}
function translateCommentedLines() {
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
function activate(context) {
    const disposable = vscode.commands.registerCommand('extension.translateCommentedLines', translateCommentedLines);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
