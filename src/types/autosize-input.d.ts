declare module 'autosize-input' {
    export default function autosizeInput(
        input: HTMLInputElement,
        options?: {
            minWidth?: number;
            maxWidth?: number;
        },
    ): () => void;
}
