/* eslint-disable max-len */
/*
  This file stores the compiler/interpretor details that are provided to DockerSandbox.sh by the app.js
  The index is the key field,
  First column contains the compiler/interpretor that will be used for translation
  Second column is the file name to use when storing the source code
  Third column is optional, it contains the command to invoke the compiled program, it is used only for compilers
  Fourth column is just the language name for display on console, for verbose error messages
  Fifth column is optional, it contains additional arguments/flags for compilers
  You can add more languages to this API by simply adding another row in this file along with installing it in your
  Docker VM.
*/

exports.compilerArray = [
  ['nodejs', 'file.js', '', 'Nodejs', ''],
  ['python', 'file.py', '', 'Python', ''],
  ['javac', 'file.java', "'./usercode/javaRunner.sh'", 'Java', ''],
];
