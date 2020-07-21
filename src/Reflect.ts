export function defineMetadata(metadataKey: any, metadataValue: any, target: unknown, propertyKey: string | symbol): void {
    (Reflect as any).defineMetadata(metadataKey, metadataValue, target, propertyKey);
}

export function getMetadata(metadataKey: any, target: unknown): any {
    return (Reflect as any).getMetadata(metadataKey, target);
}
