export function downloadUrl(url: string, fileName: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
}

export function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    downloadUrl(url, fileName);
    URL.revokeObjectURL(url);
}

export function downloadString(str: string, fileName: string) {
    const blob = new Blob([str], {type: "text/plain"});
    downloadBlob(blob, fileName);
}

export function downloadJson(obj: any, fileName: string) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {type: "application/json"});
    downloadBlob(blob, fileName);
}
