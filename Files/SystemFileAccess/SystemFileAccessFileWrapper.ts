import {AbstractFileWrapper} from "../Interface/IFileWrapper";

/**
 * Wraps a File System Access API to implement IFileWrapper.
 */
export default class SystemFileAccessFileWrapper extends AbstractFileWrapper {
    private _handle: FileSystemFileHandle;

    constructor(fileHandle: FileSystemFileHandle) {
        super();
        this._handle = fileHandle;
    }

    get name(): string {
        return this._handle.name;
    }

    async read(): Promise<Blob> {
        return await this._handle.getFile();
    }

    async append(contents: Blob): Promise<void> {
        const oldContents = await this.read();
        const newContents = new Blob([oldContents, contents]);
        return this.save(newContents);
    }

    async save(contents: Blob): Promise<void> {
        const writable = await this._handle.createWritable();
        await writable.write(contents);
        await writable.close();
    }
}
