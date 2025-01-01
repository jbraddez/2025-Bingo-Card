document.addEventListener("DOMContentLoaded", () => {
    const bingoCells = document.querySelectorAll(".bingo-cell");
    const textAreas = document.querySelectorAll(".bingo-cell textarea");
    const submitButton = document.getElementById("submit-button");
    const localStorageKey = "bingoData";
    const submitted = localStorage.getItem("Submitted") || false;

    // Function to load data from local storage
    const loadBingoData = () => {
        const bingoData = JSON.parse(localStorage.getItem(localStorageKey)) || {};
        bingoCells.forEach((cell, index) => {
            const cellId = `cell-${index + 1}`;
            const isFreeCell = cell.classList.contains("free");
            if (isFreeCell) {
                cell.classList.add("green"); // Free cell always green
            } else {
                const textArea = cell.querySelector("textarea");
                if (bingoData[cellId]) {
                    const { text, completed } = bingoData[cellId];
                    cell.textContent = text;
                    textArea.style.visibility = 'hidden'; // Disable editing after submission
                    if (completed) {
                        cell.classList.add("green");
                    }
                }
            }
            if(submitted){
                submitButton.style.visibility = 'hidden';
            }
        });
    };

    // Function to save data to local storage
    const saveBingoData = () => {
        const bingoData = {};
        bingoCells.forEach((cell, index) => {
            const cellId = `cell-${index + 1}`;
            const isFreeCell = cell.classList.contains("free");
            if (!isFreeCell && !submitted) {
                const textArea = cell.querySelector("textarea");
                bingoData[cellId] = {
                    text: textArea.value.trim(),
                    completed: cell.classList.contains("green")
                };
            }else if(!isFreeCell && submitted){
                bingoData[cellId] = {
                    text: cell.textContent.trim(),
                    completed: cell.classList.contains("green")
                };
            }
        });
        localStorage.setItem("Submitted", true);
        localStorage.setItem(localStorageKey, JSON.stringify(bingoData));
    };

    // Function to check if all text areas are filled
    const checkAllFilled = () => {
        return Array.from(textAreas).every((textArea) => textArea.value.trim() !== "");
    };

    // Event listener for submit button
    submitButton.addEventListener("click", () => {
        if (checkAllFilled()) {
            saveBingoData();
            location.reload(); // Reload the page after submission
        } else {
            alert("Please fill in all cells before submitting.");
        }
    });


    // Add click event to cells
    bingoCells.forEach((cell, index) => {
        const isFreeCell = cell.classList.contains("free");
        if (isFreeCell) return; // Skip the free cell
        cell.addEventListener("click", () => {
            if (submitted) {
                cell.classList.toggle("green");
                saveBingoData(); // Save state to local storage
            }
            // Check if all cells are completed
            const allCompleted = Array.from(bingoCells).every((cell) => {
                return cell.classList.contains("green") || cell.classList.contains("free");
            });
            if (allCompleted) {
                setTimeout(() => {
                    alert("Welldone! You won 2025! You should be proud!")
                }, 100);
            }
        });
    });

    // Initialize
    loadBingoData();
});
