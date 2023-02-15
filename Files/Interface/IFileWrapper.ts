export interface IFileWrapper {
    /**
     * Returns the name of the file with extension.
     */
    get name(): string;

    get extension(): string;

    /**
     * Writes the contents to the file.
     * It doesn't append to the file.
     * It doesn't need to be closed.
     * @param contents
     */
    save(contents: Blob): Promise<void>;

    /**
     * Appends the contents to the file.
     * It doesn't need to be closed.
     * @param contents
     */
    append(contents: Blob): Promise<void>;

    /**
     * Reads the contents of the file.
     */
    read(): Promise<Blob>;
}


export abstract class AbstractFileWrapper implements IFileWrapper {
    /**
     * Returns the name of the file with extension.
     */
    abstract get name(): string;

    /**
     * Returns the extension of the file.
     */
    get extension(): string {
        let tmp = this.name.split(".");
        if (tmp.length > 1) {
            return tmp.pop() as string;
        }
        return "";
    }

    /**
     * Writes the contents to the file.
     * It doesn't append to the file.
     * It doesn't need to be closed.
     * @param contents
     */
    abstract save(contents: Blob): Promise<void>;

    /**
     * Appends the contents to the file.
     * It doesn't need to be closed.
     * @param contents
     */
    abstract append(contents: Blob): Promise<void>;

    /**
     * Reads the contents of the file.
     */
    abstract read(): Promise<Blob>;
}
