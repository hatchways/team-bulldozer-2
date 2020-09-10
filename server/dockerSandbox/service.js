/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const PATH = require('path');
const cryptoRandomString = require('crypto-random-string');
const arr = require('./compilers');
const sandBox = require('./DockerSandbox');

exports.compile = (language, code, stdin, done) => {
  const fileSep = PATH.sep;
  const randomVal = cryptoRandomString({ length: 10 });
  // folder in which the temporary folder will be saved
  const folder = `temp${fileSep}${randomVal}`;
  // current working path
  const path = __dirname + fileSep;
  // name of virtual machine that we want to execute
  const vmName = 'houssemdev/virtual_machine:1.0';
  // Timeout Value, In Seconds
  const timeoutValue = 20;

  // details of this are present in DockerSandbox.js
  const sandboxType = new sandBox(
    timeoutValue, path, folder, vmName, arr.compilerArray[language][0],
    arr.compilerArray[language][1], code, arr.compilerArray[language][2],
    arr.compilerArray[language][3], arr.compilerArray[language][4], stdin,
  );

  // data will contain the output of the compiled/interpreted code
  // the result maybe normal program output, list of error messages or a Timeout error
  sandboxType.run((data, execTime, err) => {
    done({
      output: data, langid: language, code, errors: err, time: execTime,
    });
  });
  // console.log("Data: received: "+ data)
};
