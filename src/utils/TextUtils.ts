import ClipboardJS from 'clipboard';

const createHiddenButton = (): HTMLButtonElement => {
  const button = document.createElement('button');
  button.style.position = 'fixed';
  button.style.top = '-9999px';
  button.style.left = '-9999px';
  button.textContent = 'copy';
  document.body.appendChild(button);
  return button;
};

export const copyLinkToClipboard = async (link: string) => {
  const button = createHiddenButton();
  const clipboard = new ClipboardJS(button, { text: () => link, });

  button.click();

  clipboard.on('success', () => {
    clipboard.destroy();
    document.body.removeChild(button);
  });

  clipboard.on('error', () => {
    clipboard.destroy();
    document.body.removeChild(button);
    throw new Error('Clipboard API não suportada');
  });
};
