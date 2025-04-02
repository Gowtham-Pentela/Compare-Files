// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("result").style.display = "none";
// });

// async function readFileContent(file) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();

//         // Handle text-based files (TXT, CSV)
//         if (file.type.includes("text") || file.name.endsWith(".csv")) {
//             reader.onload = () => resolve(reader.result);
//             reader.readAsText(file);
//         }
//         // Handle DOCX files
//         else if (file.name.endsWith(".docx")) {
//             reader.onload = async (event) => {
//                 const arrayBuffer = event.target.result;
//                 const result = await mammoth.extractRawText({ arrayBuffer });
//                 resolve(result.value);
//             };
//             reader.readAsArrayBuffer(file);
//         }
//         // Unsupported format
//         else {
//             reject("Unsupported file format.");
//         }
//     });
// }

// async function compareFiles() {
//     const file1 = document.getElementById("file1").files[0];
//     const file2 = document.getElementById("file2").files[0];

//     if (!file1 || !file2) {
//         alert("Please select two files to compare.");
//         return;
//     }

//     try {
//         const content1 = (await readFileContent(file1)).split(/\r?\n/);
//         const content2 = (await readFileContent(file2)).split(/\r?\n/);

//         // Find unique lines
//         const uniqueTo1 = content1.filter(line => !content2.includes(line)).join("\n");
//         const uniqueTo2 = content2.filter(line => !content1.includes(line)).join("\n");

//         // Display results
//         document.getElementById("uniqueFile1").textContent = uniqueTo1 || "No unique content.";
//         document.getElementById("uniqueFile2").textContent = uniqueTo2 || "No unique content.";
//         document.getElementById("result").style.display = "block";
//     } catch (error) {
//         alert("Error reading files: " + error);
//     }
// }
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("result").style.display = "none";
});

async function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Handle text-based files (TXT, CSV)
        if (file.type.includes("text") || file.name.endsWith(".csv")) {
            reader.onload = () => resolve(reader.result);
            reader.readAsText(file);
        }
        // Handle DOCX files
        else if (file.name.endsWith(".docx")) {
            reader.onload = async (event) => {
                const arrayBuffer = event.target.result;
                const result = await mammoth.extractRawText({ arrayBuffer });
                resolve(result.value);
            };
            reader.readAsArrayBuffer(file);
        }
        // Handle Excel files (XLS, XLSX)
        else if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
            reader.onload = (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: 'array' });
                let textContent = '';
                workbook.SheetNames.forEach((sheetName) => {
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    jsonData.forEach(row => {
                        textContent += row.join("\t") + "\n";  // Combine cells into a tab-separated line
                    });
                });
                resolve(textContent);
            };
            reader.readAsArrayBuffer(file);
        }
        // Unsupported format
        else {
            reject("Unsupported file format.");
        }
    });
}

async function compareFiles() {
    const file1 = document.getElementById("file1").files[0];
    const file2 = document.getElementById("file2").files[0];

    if (!file1 || !file2) {
        alert("Please select two files to compare.");
        return;
    }

    try {
        const content1 = (await readFileContent(file1)).split(/\r?\n/);
        const content2 = (await readFileContent(file2)).split(/\r?\n/);

        // Find unique lines
        const uniqueTo1 = content1.filter(line => !content2.includes(line)).join("\n");
        const uniqueTo2 = content2.filter(line => !content1.includes(line)).join("\n");

        // Display results
        document.getElementById("uniqueFile1").textContent = uniqueTo1 || "No unique content.";
        document.getElementById("uniqueFile2").textContent = uniqueTo2 || "No unique content.";
        document.getElementById("result").style.display = "block";
    } catch (error) {
        alert("Error reading files: " + error);
    }
}
