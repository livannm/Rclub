import type {
  PrivatizationPayload,
  PrivatizationRequest
} from "@/lib/privatizations/privatization-schema";

export interface PrivatizationRepository {
  create(payload: PrivatizationPayload): Promise<PrivatizationRequest>;
  listAll(): Promise<PrivatizationRequest[]>;
}
