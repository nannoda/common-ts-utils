import {IFileGetter} from "../Interface/IFileGetter";
import SystemFileAccessFileWrapper from "./SystemFileAccessFileWrapper";
import {IFilePickerOptions} from "../Interface/IFilePickerOptions";

export class SystemFileAccessFileGetter implements IFileGetter {
    async showOpenDialog(options: IFilePickerOptions): Promise<SystemFileAccessFileWrapper[]> {
        let fileHandle = await window.showOpenFilePicker(options);
        if (fileHandle == null) {
            throw new Error("File is null");
        }
        let files: SystemFileAccessFileWrapper[] = [];
        for (let i = 0; i < fileHandle.length; i++) {
            files.push(new SystemFileAccessFileWrapper(fileHandle[i]));
        }
        return files;
    }

    async showSaveDialog(options: IFilePickerOptions): Promise<SystemFileAccessFileWrapper> {
        const fileHandle = await window.showSaveFilePicker(options);
        if (fileHandle == null) {
            throw new Error("File is null");
        }
        return new SystemFileAccessFileWrapper(fileHandle);
    }
}
