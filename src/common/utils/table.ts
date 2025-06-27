export class BidiMap<K, V> {
  private key2Value: Map<K, V> = new Map()
  private value2Key: Map<V, K> = new Map()
  public maxSize: number

  constructor(maxSize: number) {
    this.maxSize = maxSize
  }


  set(key: K, value: V): void {
    this.key2Value.set(key, value)
    this.value2Key.set(value, key)
    if (this.maxSize !== -1 && this.key2Value.size > this.maxSize) {
      const oldestKey = this.key2Value.keys().next().value!
      this.value2Key.delete(this.key2Value.get(oldestKey)!)
      this.key2Value.delete(oldestKey)
    }
  }

  get(key: K): V | undefined {
    return this.key2Value.get(key)
  }

  getValue(key: K): V | undefined {
    return this.key2Value.get(key)
  }

  getKey(value: V): K | undefined {
    return this.value2Key.get(value)
  }
}
