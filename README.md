# NLP++ Language Extension

## Version One Released!
Version one of the NLP langauge extension for VSCODE has been released. This version comes with the engine built in for all three platforms. It is no longer necessary to load the NLP engine separately from github.

## Introduction

This is a VSCode Language Extension for NLP++ that recreates the functionality of [VisualText](http://visualtext.org) which has run on Microsoft Windows for the last two decades. NLP++ is a open source computer language specifically dedicated to creating text analyzers that mimic human readers and includes the NLP++ language and knowledge based system called the "conceptual grammar". NLP++ is used for any type of text processing from simple tagging or extraction, to full language parsing. There is a full english parser that is free an available for use (see information below).

The language extension and the required NLP-ENGINE run on Linux, Windows, and MacOS.

## Features

The NLP++ language extension allows for the fast development of NLP++ analyzers allowing users to:

* Quickly generate and edit NLP++ code
* Display the syntax tree in insightful ways
* Highlight text that has matched rules in each pass
* Display the knowledge base at strategic places in the analyzer sequence
* Easily edit and modify the pass sequence and texts to be analyze
* Display syntax errors to NLP++
* Auto generate rules
* Extensive snippets
* Help lookup

### NLP++ Example Analyzers

Example analyzers can be found in the "analyzers" folder in the NLP-ENGINE folder.

![NLP++ Language Extension opening example analyzers including the full English parser](resources/OpeningAnalyzersFolder.gif)

## Requirements

In order to use the VSCode NLP++ Language Extension, the NLP-ENGINE which is in the form of an executable and directory need to be present. Version one now includes this as part of the NLP language extension.

### NLP Engine

The NLP-ENGINE is available separately on the [VisualText github repository](https://gihub.com/VisualText/nlp-engine) which must be downloaded from github and compiled. The executable nlp.exe and runs on Linux, Windows, and MacOS and can be embedded into c++ code.

### Compiling the NLP ENGINE

Currently, the NLP ENGINE must be downloaded and compiled separately. It will be bundled with the VSCODE-NLP language extension in the near future. The code and compiling instructions can be found in the [NLP-ENGINE Repository](https://github.com/VisualText/nlp-engine)

### Types of Analyzers Commonly Written Using NLP++

There are many types of analyzers that are written by NLP++ programmers including:

* Tagging of text
* Extract emails, dates, addresses, etc from unstructured text
* Entity Extraction
* Full NLP Parsing
* Sentiment analysis
* OCR Cleanup
* Extraction of data from messy text
* Autogenerate snippets from documentation

## Extension Settings

Version 1 of the NLP language extension now contains the path to the nlp-engine directory, the current analyzer to load, and the user name. These can be found in the general settings unders "Extensions" and "NLP".

### Analyzer state.json

This file will automatically get generated when a new analyzer is created in VisualText VSCode. It is located in the .vscode directory under the folder for an individual analyzer.

    {
        "visualText": [
            {
                "name": "Analyzer",
                "type": "state",
                "currentTextFile": "/YOUR-PATH-HERE/nlp-engine/analyzers/corporate/input/Dev/Sold.txt",
                "currentPassFile": "/YOUR-PATH-HERE/nlp-engine/analyzers/corporate/spec/lookup.pat"
            }
        ]
    }
    
## Development

You must have installed the NLP-ENGINE in order to use this VSCode extension. You can find how to install this at: [https://github.com/VisualText/vscode-nlp](https://github.com/VisualText/vscode-nlp).

Follow these instructions to install the development code for VSCode extension:

    cd /Some/Dev/Folder/
    git clone https://github.com/VisualText/vscode-nlp.git
    cd vscode-nlp
    npm install

At which point you can open the `vscode-nlp` folder within VS Code.

Next start the background build process by running the following command within a terminal session:

    npm run watch
    
At which point you can edit the sources and launch debug sessions via F5 and included launch configurations.

## Known Issues

There are many details in the windows version of VisualText that are yet to be implemented in the VSCode version.

## Release Notes

### v1.0.4

The NLP engine executable and engine directory are now included in the NLP language extension for VSCode. The location of the engine is located in a subdirectory of the nlp extensions located in the extension directory located on the local computer. See documentation for VSCODE if you want to know the location of the directory which is different for different platforms.

### v0.9.29

Fixing minor problems

### v0.9.27

Fixing paths for calling nlp.exe and missing npm package

### v0.9.24

Fixed file path problem across platforms

### v0.9.23

Initial version with ongoing minor fixes

## License

[MIT](https://github.com/VisualText/vscode-nlp/blob/master/LICENSE)

