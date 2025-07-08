import { FilterState } from "@/hooks/useFilterState"

interface CachedCalculations {
  timestamp: number
  dataHash: string
  calculations: any
}

interface CacheKey {
  type: 'transaction' | 'reward'
  filters: string
}

export class CalculationsCacheService {
  private static instances: Map<string, CalculationsCacheService> = new Map()
  private cache = new Map<string, CachedCalculations>()
  private pageName: string

  private constructor(pageName: string) {
    this.pageName = pageName
  }

  public static getInstance(pageName: string = 'default'): CalculationsCacheService {
    if (!CalculationsCacheService.instances.has(pageName)) {
      CalculationsCacheService.instances.set(pageName, new CalculationsCacheService(pageName))
    }
    return CalculationsCacheService.instances.get(pageName)!
  }

  private generateCacheKey(type: 'transaction' | 'reward', filters: any): string {
    const filterString = JSON.stringify(filters)
    return `${type}_${filterString}`
  }

  private generateDataHash(data: any[]): string {
    // Simple hash based on data length and last item
    const lastItem = data[data.length - 1]
    return `${data.length}_${lastItem?.id || 'empty'}_${lastItem?.date || 'no-date'}`
  }

  public getCachedCalculations(
    type: 'transaction' | 'reward',
    filters: any,
    currentData: any[],
    calculateFn: () => any
  ): any {
    const cacheKey = this.generateCacheKey(type, filters)
    const dataHash = this.generateDataHash(currentData)
    const cached = this.cache.get(cacheKey)

    // Check if cache is valid (only based on data hash, no time expiration)
    if (cached && cached.dataHash === dataHash) {
      console.log(`Using cached ${type} calculations for ${this.pageName}:`, filters)
      return cached.calculations
    }

    // Calculate fresh values
    console.log(`Calculating fresh ${type} calculations for ${this.pageName}:`, filters)
    const calculations = calculateFn()

    // Store in cache
    this.cache.set(cacheKey, {
      timestamp: Date.now(),
      dataHash,
      calculations
    })

    return calculations
  }

  public invalidateCache(type?: 'transaction' | 'reward'): void {
    if (type) {
      // Remove all entries for specific type
      const keysToDelete = Array.from(this.cache.keys()).filter(key => key.startsWith(type))
      keysToDelete.forEach(key => this.cache.delete(key))
      console.log(`Invalidated ${type} cache for ${this.pageName}`)
    } else {
      // Clear entire cache
      this.cache.clear()
      console.log(`Cleared entire calculations cache for ${this.pageName}`)
    }
  }

  public static invalidateAllCaches(type?: 'transaction' | 'reward'): void {
    CalculationsCacheService.instances.forEach((instance, pageName) => {
      instance.invalidateCache(type)
    })
    console.log(`Invalidated ${type || 'all'} caches across all pages`)
  }

  public getCacheStats(): { size: number; entries: string[]; pageName: string } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
      pageName: this.pageName
    }
  }

  public static getAllCacheStats(): Array<{ size: number; entries: string[]; pageName: string }> {
    return Array.from(CalculationsCacheService.instances.values()).map(instance => instance.getCacheStats())
  }

  public static refreshAllCaches(): void {
    CalculationsCacheService.instances.forEach((instance, pageName) => {
      instance.cache.clear()
      console.log(`Cleared calculation cache for ${pageName}`)
    })
    console.log("Refreshed all calculation caches")
  }
}

// Create page-specific cache instances
export const transactionCacheService = CalculationsCacheService.getInstance('transactions')
export const rewardCacheService = CalculationsCacheService.getInstance('rewards')

// Keep the default instance for backward compatibility
export const calculationsCacheService = CalculationsCacheService.getInstance('default')
