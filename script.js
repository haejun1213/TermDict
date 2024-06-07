document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('word-input');
    const meaningInput = document.getElementById('meaning-input');
    const sourceInput = document.getElementById('source-input');
    const saveButton = document.getElementById('save-button');
    const wordList = document.getElementById('word-list');
    const searchInput = document.getElementById('search-input');

    const saveWord = () => {
        const word = wordInput.value.trim();
        const meaning = meaningInput.value.trim();
        const source = sourceInput.value.trim();

        if (word && meaning) {
            const wordData = { word, meaning, source };
            const storedWords = JSON.parse(localStorage.getItem('words')) || [];
            storedWords.push(wordData);
            localStorage.setItem('words', JSON.stringify(storedWords));
            displayWords();
            wordInput.value = '';
            meaningInput.value = '';
            sourceInput.value = '';
        }
    };

    const displayWords = (filter = '') => {
        wordList.innerHTML = '';
        const storedWords = JSON.parse(localStorage.getItem('words')) || [];
        const filteredWords = storedWords.filter(wordData => 
            wordData.word.includes(filter) || wordData.meaning.includes(filter)
        );
        filteredWords.forEach((wordData, index) => {
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item';
            wordItem.innerHTML = `
                <div class="text"><strong>${wordData.word}</strong>: ${wordData.meaning} (출처: ${wordData.source})</div>
                <div class="actions">
                    <button class="edit-button"><i class="fa-solid fa-pen"></i></button>
                </div>
                <div class="edit-inputs">
                    <input type="text" value="${wordData.word}" class="edit-word-input">
                    <textarea class="edit-meaning-input">${wordData.meaning}</textarea>
                    <textarea class="edit-source-input">${wordData.source}</textarea>
                </div>
                <div class="edit-actions">
                    <button class="save-button"><i class="fa-solid fa-check"></i></button>
                    <button class="delete-button"><i class="fa-solid fa-trash"></i></button>
                    <button class="cancel-button"><i class="fa-solid fa-x"></i></button>
                </div>
            `;

            wordList.appendChild(wordItem);

            const editButton = wordItem.querySelector('.edit-button');
            const saveButton = wordItem.querySelector('.save-button');
            const deleteButton = wordItem.querySelector('.delete-button');
            const cancelButton = wordItem.querySelector('.cancel-button');

            editButton.addEventListener('click', () => {
                wordItem.classList.add('edit-mode');
            });

            saveButton.addEventListener('click', () => {
                const editWordInput = wordItem.querySelector('.edit-word-input').value.trim();
                const editMeaningInput = wordItem.querySelector('.edit-meaning-input').value.trim();
                const editSourceInput = wordItem.querySelector('.edit-source-input').value.trim();

                if (editWordInput && editMeaningInput) {
                    storedWords[index] = {
                        word: editWordInput,
                        meaning: editMeaningInput,
                        source: editSourceInput
                    };
                    localStorage.setItem('words', JSON.stringify(storedWords));
                    displayWords(searchInput.value);
                }
            });

            deleteButton.addEventListener('click', () => {
                storedWords.splice(index, 1);
                localStorage.setItem('words', JSON.stringify(storedWords));
                displayWords(searchInput.value);
            });

            cancelButton.addEventListener('click', () => {
                wordItem.classList.remove('edit-mode');
            });
        });
    };

    saveButton.addEventListener('click', saveWord);
    searchInput.addEventListener('input', () => displayWords(searchInput.value));
    

    displayWords();
});
