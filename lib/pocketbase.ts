// PocketBase client wrapper for type-safe database interactions
import PocketBase, { BaseAuthStore } from 'pocketbase'
import { z } from 'zod'

// Types for our database collections
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().optional(),
  verified: z.boolean().default(false),
  subscription_tier: z.enum(['free', 'pro', 'enterprise']).default('free'),
  created: z.string(),
  updated: z.string(),
})

export const SubscriptionSchema = z.object({
  id: z.string(),
  user: z.string(),
  stripe_customer_id: z.string().optional(),
  stripe_subscription_id: z.string().optional(),
  status: z.enum(['active', 'canceled', 'past_due', 'incomplete']),
  tier: z.enum(['free', 'pro', 'enterprise']),
  current_period_start: z.string().optional(),
  current_period_end: z.string().optional(),
  cancel_at_period_end: z.boolean().default(false),
  created: z.string(),
  updated: z.string(),
})

export const LLMJobSchema = z.object({
  id: z.string(),
  user: z.string(),
  prompt: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  output: z.string().optional(),
  error: z.string().optional(),
  model: z.string().optional(),
  parameters: z.record(z.any()).optional(),
  started_at: z.string().optional(),
  completed_at: z.string().optional(),
  tokens_used: z.number().optional(),
  cost: z.number().optional(),
  created: z.string(),
  updated: z.string(),
})

export const InvoiceSchema = z.object({
  id: z.string(),
  user: z.string(),
  subscription: z.string().optional(),
  stripe_invoice_id: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(['draft', 'open', 'paid', 'void', 'uncollectible']),
  description: z.string().optional(),
  invoice_pdf: z.string().optional(),
  due_date: z.string().optional(),
  paid_at: z.string().optional(),
  billing_period_start: z.string().optional(),
  billing_period_end: z.string().optional(),
  created: z.string(),
  updated: z.string(),
})

export type User = z.infer<typeof UserSchema>
export type Subscription = z.infer<typeof SubscriptionSchema>
export type LLMJob = z.infer<typeof LLMJobSchema>
export type Invoice = z.infer<typeof InvoiceSchema>

// PocketBase client class
class PocketBaseClient {
  private pb: PocketBase

  constructor(url?: string) {
    const baseUrl = url || process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
    this.pb = new PocketBase(baseUrl)
  }

  // Authentication methods
  async signUp(email: string, password: string, name: string) {
    try {
      const user = await this.pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        name,
      })

      return { success: true, user: UserSchema.parse(user) }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async signIn(email: string, password: string) {
    try {
      const authData = await this.pb.collection('users').authWithPassword(email, password)
      return { success: true, user: UserSchema.parse(authData.record) }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async signOut() {
    this.pb.authStore.clear()
  }

  async requestPasswordReset(email: string) {
    try {
      await this.pb.collection('users').requestPasswordReset(email)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  get currentUser() {
    if (this.pb.authStore.isValid && this.pb.authStore.model) {
      return UserSchema.parse(this.pb.authStore.model)
    }
    return null
  }

  get isAuthenticated() {
    return this.pb.authStore.isValid
  }

  // User methods
  async getUser(id: string) {
    try {
      const user = await this.pb.collection('users').getOne(id)
      return UserSchema.parse(user)
    } catch (error: any) {
      throw new Error(`Failed to get user: ${error.message}`)
    }
  }

  async updateUser(id: string, data: Partial<Pick<User, 'name' | 'avatar'>>) {
    try {
      const user = await this.pb.collection('users').update(id, data)
      return UserSchema.parse(user)
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`)
    }
  }

  // Subscription methods
  async getUserSubscription(userId: string) {
    try {
      const subscriptions = await this.pb.collection('subscriptions').getList(1, 1, {
        filter: `user = "${userId}"`,
      })

      if (subscriptions.items.length > 0) {
        return SubscriptionSchema.parse(subscriptions.items[0])
      }
      return null
    } catch (error: any) {
      throw new Error(`Failed to get subscription: ${error.message}`)
    }
  }

  async createSubscription(data: Omit<Subscription, 'id' | 'created' | 'updated'>) {
    try {
      const subscription = await this.pb.collection('subscriptions').create(data)
      return SubscriptionSchema.parse(subscription)
    } catch (error: any) {
      throw new Error(`Failed to create subscription: ${error.message}`)
    }
  }

  async updateSubscription(id: string, data: Partial<Subscription>) {
    try {
      const subscription = await this.pb.collection('subscriptions').update(id, data)
      return SubscriptionSchema.parse(subscription)
    } catch (error: any) {
      throw new Error(`Failed to update subscription: ${error.message}`)
    }
  }

  // LLM Job methods
  async createLLMJob(data: Omit<LLMJob, 'id' | 'created' | 'updated'>) {
    try {
      const job = await this.pb.collection('llm_jobs').create(data)
      return LLMJobSchema.parse(job)
    } catch (error: any) {
      throw new Error(`Failed to create LLM job: ${error.message}`)
    }
  }

  async getLLMJob(id: string) {
    try {
      const job = await this.pb.collection('llm_jobs').getOne(id)
      return LLMJobSchema.parse(job)
    } catch (error: any) {
      throw new Error(`Failed to get LLM job: ${error.message}`)
    }
  }

  async getUserLLMJobs(userId: string, page = 1, perPage = 20) {
    try {
      const jobs = await this.pb.collection('llm_jobs').getList(page, perPage, {
        filter: `user = "${userId}"`,
        sort: '-created',
      })
      return {
        items: jobs.items.map(job => LLMJobSchema.parse(job)),
        totalItems: jobs.totalItems,
        totalPages: jobs.totalPages,
      }
    } catch (error: any) {
      throw new Error(`Failed to get LLM jobs: ${error.message}`)
    }
  }

  async updateLLMJob(id: string, data: Partial<LLMJob>) {
    try {
      const job = await this.pb.collection('llm_jobs').update(id, data)
      return LLMJobSchema.parse(job)
    } catch (error: any) {
      throw new Error(`Failed to update LLM job: ${error.message}`)
    }
  }

  // Invoice methods
  async getUserInvoices(userId: string, page = 1, perPage = 20) {
    try {
      const invoices = await this.pb.collection('invoices').getList(page, perPage, {
        filter: `user = "${userId}"`,
        sort: '-created',
      })
      return {
        items: invoices.items.map(invoice => InvoiceSchema.parse(invoice)),
        totalItems: invoices.totalItems,
        totalPages: invoices.totalPages,
      }
    } catch (error: any) {
      throw new Error(`Failed to get invoices: ${error.message}`)
    }
  }

  async getInvoice(id: string) {
    try {
      const invoice = await this.pb.collection('invoices').getOne(id)
      return InvoiceSchema.parse(invoice)
    } catch (error: any) {
      throw new Error(`Failed to get invoice: ${error.message}`)
    }
  }

  // Real-time subscriptions
  subscribeToLLMJobs(userId: string, callback: (data: any) => void) {
    return this.pb.collection('llm_jobs').subscribe('*', (e) => {
      if (e.record.user === userId) {
        callback(e)
      }
    })
  }

  subscribeToUser(userId: string, callback: (data: any) => void) {
    return this.pb.collection('users').subscribe(userId, callback)
  }

  unsubscribe(subscription: any) {
    this.pb.collection('llm_jobs').unsubscribe(subscription)
    this.pb.collection('users').unsubscribe(subscription)
  }

  // File upload helper
  async uploadFile(file: File, collection: string, recordId?: string) {
    try {
      if (recordId) {
        // Update existing record
        return await this.pb.collection(collection).update(recordId, {
          [file.name]: file,
        })
      } else {
        // Create new record with file
        return await this.pb.collection(collection).create({
          [file.name]: file,
        })
      }
    } catch (error: any) {
      throw new Error(`Failed to upload file: ${error.message}`)
    }
  }
}

// Export singleton instance
export const pb = new PocketBaseClient()

// Export class for custom instances
export { PocketBaseClient }
