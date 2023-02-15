import {IFileWrapper} from "./IFileWrapper";
import {IFilePickerOptions} from "./IFilePickerOptions";

export interface IFileGetter {


    /**
     * Show a dialog to allow the user to open an existing file.
     */
    showOpenDialog(options: IFilePickerOptions): Promise<IFileWrapper[]>;

    /**
     * Show a dialog to allow the user to save a new file.
     */
    showSaveDialog(options: IFilePickerOptions): Promise<IFileWrapper>;
}
