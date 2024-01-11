import { UseCase } from "@domain/common/use-case";
import { Controller } from "@presentation/common";

export interface Factory {
  useCase: UseCase<any, any>;
  controller: Controller;

  create(): Controller;
}
