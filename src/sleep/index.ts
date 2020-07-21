import { func } from "@hapi/joi";

export default function sleep(ms: number): Promise<void> {
    return new Promise<void>(r => setTimeout(() => r(), ms));
}