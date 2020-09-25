export default function editTitleBar(titleBarProps) {
  const { leftLink, leftText, title, rightLink, rightText } = titleBarProps;

  const titleBar = document.getElementById('titleBar');
  titleBar.querySelector('leftLink a')

  const leftLink2 = titleBar.querySelector('#leftLink');
  leftLink2.href = '/';
  leftLink2.textContent = 'Hello';
  titleBar.querySelector('h1').textContent = 'Troll'
}

