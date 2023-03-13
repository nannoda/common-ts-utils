export class ShortcutManager {
    shortcuts: Shortcut[] = [];

    constructor() {
        document.addEventListener("keydown", (e) => {
            this.activateShortcut(e);
            return true;
        });
    }

    activateShortcut(event: KeyboardEvent) {
        console.log("Event: " + event.key);
        for (let shortcut of this.shortcuts) {
            if (shortcut.key == event.key) {
                shortcut.callback();
                event.preventDefault();
                return;
            }
        }
    }

    addShortcut(shortcut: Shortcut) {
        this.shortcuts.push(shortcut);
    }

    registerShortcut(key: string, callback: () => void) {
        this.addShortcut(Shortcut.fromString(key, callback));
    }

    removeShortcut(key: string) {
        for (let i = 0; i < this.shortcuts.length; i++) {
            if (this.shortcuts[i].key == key) {
                this.shortcuts.splice(i, 1);
                return;
            }
        }
    }
}

export const shortcutManager = new ShortcutManager();

export class Shortcut {
    key: string;
    ctrlKey: boolean = false;
    shiftKey: boolean = false;
    metaKey: boolean = false;
    altKey: boolean = false;

    callback: () => void;

    constructor(key: string, ctrl: boolean, shift: boolean, meta: boolean, altKey: boolean, execute: () => void) {
        this.key = key;
        this.ctrlKey = ctrl;
        this.shiftKey = shift;
        this.metaKey = meta;
        this.altKey = altKey;

        this.callback = execute;
    }

    static fromString(shortcut: string, execute: () => void) {
        let ctrl = false;
        let shift = false;
        let meta = false;
        let alt = false;
        let key = "";

        let parts = shortcut.split("+");
        if (parts.length < 1 || parts.length > 5) {
            throw new Error("Invalid shortcut");
        }

        for (let part of parts) {
            switch (part) {
                case "ctrl":
                    ctrl = true;
                    break;
                case "shift":
                    shift = true;
                    break;
                case "meta":
                    meta = true;
                    break;
                case "alt":
                    alt = true;
                    break;
                default:
                    key = part;
                    break;
            }
        }

        return new Shortcut(key, ctrl, shift, meta, alt, execute);
    }

    matches(event: KeyboardEvent) {
        if (event.key != this.key) {
            return false;
        }

        if (event.ctrlKey != this.ctrlKey) {
            return false;
        }

        if (event.shiftKey != this.shiftKey) {
            return false;
        }

        if (event.metaKey != this.metaKey) {
            return false;
        }

        if (event.altKey != this.altKey) {
            return false;
        }

        return true;
    }
}

/**
 * Register a shortcut
 * @param shortcut The shortcut to register
 * @param execute The callback to execute when the shortcut is activated
 */
export function addShortcut(shortcut: string, execute: () => void) {
    shortcutManager.addShortcut(Shortcut.fromString(shortcut, execute));
}
