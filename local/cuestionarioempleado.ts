import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("cuestionarioempleado")
export class CuestionarioEmpleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  apellidos: string;

  @Column({ nullable: true })
  celular: string;

  @Column({ nullable: true })
  nombres: string;

  @Column({ nullable: true })
  nro_doc: string;

  @Column({ nullable: true })
  empresa: string;

  @Column({ nullable: true })
  area: string;

  @Column({ nullable: true })
  puesto: string;

  @Column({ length: 1, nullable: true })
  sintomaCongestion: string;

  @Column({ length: 1, nullable: true })
  sintomaDiarrea: string;

  @Column({ length: 1, nullable: true })
  sintomaDolorCabeza: string;

  @Column({ length: 1, nullable: true })
  sintomaFiebre: string;

  @Column({ length: 1, nullable: true })
  sintomaIrritabilidad: string;

  @Column({ length: 1, nullable: true })
  sintomaOlor: string;

  @Column({ length: 1, nullable: true })
  sintomaSabor: string;

  @Column({ length: 1, nullable: true })
  sintomaTos: string;

  @Column({
    type: "datetime2",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fecha: string;

  @Column({ length: 1, nullable: true })
  apto: string;
}
