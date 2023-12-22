
const verify = () => {
  document.getElementById('sn').value = document.getElementById('sn').value.substring(0, 4);
  const input = document.getElementById('sn').value;
  const arr = [...input];
  // return 1;
  // console.log(`${arr[0]}학년 ${arr[1]}반 ${arr[2]}${arr[3]}번`);
  if (Number(input) == 9090) {
    return '1';
  }
  if (input[0] == '0' || input[1] == '0') {
    // console.log('올바른 학번을 입력해주세요.');
    return '-1';
  }
  if (arr[0] > 3 || arr[1] > 5 || arr[2] > 3 || arr[3] == 0) {
    // console.log('올바른 학번을 입력해주세요.');
    // return '-1';
  }
  else if (arr[0] > 3 || arr[1] > 5 || arr[2] > 2 || arr[3] > 9) {
    // console.log('올바른 학번을 입력해주세요.');
    return '-1';
  }
  if (Number(input) >= 1101 && Number(input) < 1600) {
    // console.log('1학년');
    return '1';
  } else if (Number(input) >= 2101 && Number(input) < 2600) {
    // console.log('2학년');
    return '2';
  } else if (Number(input) >= 3101 && Number(input) < 3600) {
    // console.log('3학년');
    return '3';
  } else if (input == '') {
    // console.log('학번을 입력해주세요.');
    return '4';
  }
  return '0';
}

setInterval(() => {
  if (verify() >= 1 && verify() <= 3) {
    document.getElementById('submit').disabled = false;
    document.getElementById('error').innerHTML = '';
  } else if (verify() == '4') {
    document.getElementById('submit').disabled = true;
    document.getElementById('error').innerHTML = '학번을 입력해주세요.';
  } else if (verify() == '-1') {
    document.getElementById('submit').disabled = true;
    document.getElementById('error').innerHTML = '존재하는 학번을 입력해주세요.';
  
  } else {
    document.getElementById('submit').disabled = true;
    document.getElementById('error').innerHTML = '올바른 학번을 입력해주세요.';
    // console.log('올바른 학번을 입력해주세요.');
  }
  const input = document.getElementById('sn').value;
  const arr = [...input];
  /*if (arr[3] == undefined) {
    arr[3] = arr[2];
    arr[2] = '0';
  }*/
  document.getElementById('info').innerHTML = ((`${arr[0]}학년 ${arr[1]}반 ${arr[2]}${arr[3]}번`).replaceAll('undefined', '?')+` ${document.getElementById('name').value}`);
}, 0);

document.getElementById('name').focus();