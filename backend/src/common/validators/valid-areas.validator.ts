import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const EPSILON = 1e-9;

export function areasSaoValidas(input: {
  areaTotal: number;
  areaAgricultavel: number;
  areaVegetacao: number;
}): boolean {
  const areaTotal = Number(input.areaTotal);
  const areaAgricultavel = Number(input.areaAgricultavel);
  const areaVegetacao = Number(input.areaVegetacao);

  if ([areaTotal, areaAgricultavel, areaVegetacao].some((n) => Number.isNaN(n))) {
    return true;
  }

  return areaAgricultavel + areaVegetacao <= areaTotal + EPSILON;
}

@ValidatorConstraint({ name: 'areasValidas', async: false })
class AreasValidasConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    return areasSaoValidas(args.object as any);
  }

  defaultMessage(): string {
    return 'areaAgricultavel + areaVegetacao não pode ser maior que areaTotal';
  }
}

/**
 * Validador de classe (regra de negócio #3): garante feedback rápido no DTO.
 * A mesma regra é reforçada no service (validarAreas), que também cobre
 * updates parciais onde nem todos os campos de área vêm no payload.
 */
export function ValidAreas(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validAreas',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: AreasValidasConstraint,
    });
  };
}
