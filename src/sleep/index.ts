export default function sleep(ms: number): Promise<void> {
    return new Promise<void>(r => setTimeout(() => r(), ms));
}