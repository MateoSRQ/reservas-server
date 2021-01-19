import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("cuestionario")
export class Cuestionario {
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
  sintoma_congestion: string;

  @Column({ length: 1, nullable: true })
  sintoma_diarrea: string;

  @Column({ length: 1, nullable: true })
  sintoma_dolor_cabeza: string;

  @Column({ length: 1, nullable: true })
  sintoma_fiebre: string;

  @Column({ length: 1, nullable: true })
  sintoma_irritabilidad: string;

  @Column({ length: 1, nullable: true })
  sintoma_olor: string;

  @Column({ length: 1, nullable: true })
  sintoma_tos: string;

  @Column({
    type: "datetime2",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fecha: string;

  @Column({ length: 1, nullable: true })
  apto: string;
}
