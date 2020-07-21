export function defineMetadata(metadataKey: any, metadataValue: any, target: Object, propertyKey: string | symbol): void {
    (Reflect as any).defineMetadata(metadataKey, metadataValue, target, propertyKey);
}

export function getMetadata(metadataKey: any, target: Object): any {
    return (Reflect as any).getMetadata(metadataKey, target)
}
