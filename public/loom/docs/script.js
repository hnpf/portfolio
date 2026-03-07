document.addEventListener('DOMContentLoaded', () => {
    const codeBlocks = document.querySelectorAll('pre');
    // yes this is really just for the copy button..
    codeBlocks.forEach((block) => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerText = 'Copy';

        block.appendChild(copyBtn);

        copyBtn.addEventListener('click', () => {
            const code = block.querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.innerText = 'Copied!';
                copyBtn.classList.add('copied');

                setTimeout(() => {
                    copyBtn.innerText = 'Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });
    });
});
