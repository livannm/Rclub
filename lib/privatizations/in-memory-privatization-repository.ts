import type {
  PrivatizationPayload,
  PrivatizationRequest
} from "@/lib/privatizations/privatization-schema";
import type { PrivatizationRepository } from "@/lib/privatizations/privatization-repository";

export class InMemoryPrivatizationRepository implements PrivatizationRepository {
  private requests: PrivatizationRequest[] = [];

  async create(payload: PrivatizationPayload) {
    const created: PrivatizationRequest = {
      ...payload,
      id: crypto.randomUUID(),
      status: "new",
      created_at: new Date().toISOString()
    };

    this.requests.push(created);
    return created;
  }

  async listAll() {
    return [...this.requests];
  }
}
