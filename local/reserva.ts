import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("reserva")
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombres: string;

  @Column()
  apellido_paterno: string;

  @Column()
  apellido_materno: string;

  @Column()
  direccion: string;

  @Column()
  distrito: string;

  @Column()
  email: string;

  @Column({ type: "date" })
  edad: string;

  @Column()
  sexo: string;

  @Column()
  phone: string;

  @Column()
  nrodocumento: string;

  @Column()
  day: string;

  @Column()
  name: string;

  @Column({ type: "time" })
  hourBegin: string;

  @Column({ type: "time" })
  hourEnd: string;

  @Column({ type: "date" })
  date: string;

  @Column()
  place: string;

  @Column()
  door: string;

  @Column()
  quota: number;

  @Column({ nullable: true })
  parent_doc: string;
}
