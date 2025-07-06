CREATE DATABASE kesra_gubsu;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; --jalankan 1x saja untuk mengaktifkan ekstensi UUID

CREATE TABLE provinces (
    provinces_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    named VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE regencies (
    regencies_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    province_id INTEGER      NOT NULL REFERENCES provinces(provinces_id) ON DELETE CASCADE,
    named        VARCHAR(100) NOT NULL,
    type        VARCHAR(10)  NOT NULL CHECK (type IN ('Kabupaten','Kota')),
    UNIQUE (province_id, named)
);

CREATE TABLE admins (
    admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL, 
	email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
	gender VARCHAR(20) NOT NULL CHECK (gender IN ('Pria', 'Wanita')),
	phone_number VARCHAR(20) NOT NULL UNIQUE,
    nip VARCHAR(25) UNIQUE NOT NULL, --nomor induk pegawai
    positions VARCHAR(100) NOT NULL, --jabatan
    address TEXT NOT NULL,
	suspend BOOLEAN DEFAULT FALSE, --digunakan untuk menonaktifkan admin
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nik VARCHAR(35) UNIQUE NOT NULL, --nomor induk kependudukan
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Pria', 'Wanita')),
    address TEXT NOT NULL,
    id_card_photo TEXT NOT NULL, --foto ktp
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ, --waktu verifikasi oleh admin
    verified_by_admin_id UUID REFERENCES admins(admin_id) ON DELETE SET NULL,
    suspend BOOLEAN DEFAULT FALSE, --digunakan untuk menonaktifkan user
    register_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    profile_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    birth_date DATE,
    phone_number VARCHAR(20),
    profile_photo TEXT,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE incoming_mail(
	mail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	mail_no TEXT NOT NULL,
	mail_file TEXT NOT NULL,
	input_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	input_by_admin_id UUID REFERENCES admins(admin_id) ON DELETE SET NULL
);

CREATE TABLE outgoing_mail(
	mail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	mail_no TEXT NOT NULL,
	mail_file TEXT NOT NULL,
	input_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	input_by_admin_id UUID REFERENCES admins(admin_id) ON DELETE SET NULL
);

CREATE TABLE proposal_types (
  type_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  named TEXT NOT NULL
);

CREATE TABLE hibah_sub_categories (
  sub_id  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type_id INTEGER REFERENCES proposal_types(type_id) ON DELETE SET NULL,
  named    TEXT NOT NULL
);

CREATE TABLE academic_levels (
  lev_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- S1/S2/S3 is tiny, identity not needed
  description VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE proposals (
  proposal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_id     INTEGER REFERENCES proposal_types(type_id),
  regencies_id INTEGER REFERENCES regencies(regencies_id),
  address     TEXT NOT NULL,
  surat_from  TEXT NOT NULL,
  nomor_surat VARCHAR(100) UNIQUE NOT NULL,
  tanggal_surat DATE NOT NULL,
  perihal     TEXT,
  input_by    UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hibah_details (
  proposal_id UUID PRIMARY KEY
             REFERENCES proposals(proposal_id) ON DELETE CASCADE,
  sub_id      INTEGER NOT NULL REFERENCES hibah_sub_categories(sub_id),
  nomor_sekda        VARCHAR(50) UNIQUE, 
  tgl_nomor_sekda    DATE,
  nomor_gubernur     VARCHAR(50) UNIQUE,
  tgl_nomor_gubernur DATE,
  nama_pengurus      TEXT NOT NULL,
  nominal_anggaran   NUMERIC(18,2) NOT NULL
);

CREATE TABLE beasiswa_details (
  proposal_id UUID PRIMARY KEY
             REFERENCES proposals(proposal_id) ON DELETE CASCADE,
  univ_name   TEXT NOT NULL,
  academic_level INTEGER NOT NULL REFERENCES academic_levels(lev_id),
  scan_permohonan_path TEXT NOT NULL
);

CREATE TYPE file_kind AS ENUM (
  'surat_permohonan', 'rab', 'permohonan_beasiswa'
);

CREATE TABLE attachments (
  attach_id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES proposals(proposal_id) ON DELETE CASCADE,
  kind        file_kind NOT NULL,
  file_name   TEXT,
  file_path   TEXT,
  file_size   INT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO proposal_types (named)
VALUES 
  ('Hibah'),
  ('Beasiswa');
  
INSERT INTO hibah_sub_categories (type_id, named)
VALUES 
  (1, 'Pendidikan'),
  (1, 'Rumah Ibadah'),
  (1, 'Kelembagaan');
  
INSERT INTO academic_levels (description)
VALUES 
  ('S1'),
  ('S2'),
  ('S3');

select * from admins;
select * from users;
select * from user_profiles;
select * from outgoing_mail;
select * from incoming_mail;
select * from provinces;
select * from regencies;

SELECT p.name AS provinsi, r.type, r.name
FROM regencies r
JOIN provinces p ON r.province_id = p.id
ORDER BY r.type DESC, r.name;

//proposal hibah
SELECT 
  p.proposal_id,
  p.surat_from,
  p.nomor_surat,
  p.tanggal_surat,
  p.perihal,
  p.address,
  r.name AS regency_name,
  hs.sub_id,
  hsc.named AS sub_category,
  hs.nomor_sekda,
  hs.tgl_nomor_sekda,
  hs.nomor_gubernur,
  hs.tgl_nomor_gubernur,
  hs.nama_pengurus,
  hs.nominal_anggaran,
  a.kind AS lampiran_jenis,
  a.file_path AS lampiran_path,
  u.full_name AS input_by_user,
  p.created_at
FROM proposals p
JOIN hibah_details hs ON p.proposal_id = hs.proposal_id
JOIN hibah_sub_categories hsc ON hs.sub_id = hsc.sub_id
JOIN regencies r ON p.regencies_id = r.regencies_id
LEFT JOIN attachments a ON a.proposal_id = p.proposal_id
JOIN users u ON p.input_by = u.user_id
WHERE p.type_id = 1
ORDER BY p.created_at DESC;


//proposal beasiswa
SELECT 
  p.proposal_id,
  p.surat_from,
  p.nomor_surat,
  p.tanggal_surat,
  p.perihal,
  p.address,
  r.name AS regency_name,
  bd.univ_name,
  bd.academic_level,
  al.description AS academic_level_description,
  bd.scan_permohonan_path,
  u.full_name AS input_by_user,
  p.created_at
FROM proposals p
JOIN beasiswa_details bd ON p.proposal_id = bd.proposal_id
JOIN academic_levels al ON bd.academic_level = al.lev_id
JOIN regencies r ON p.regencies_id = r.regencies_id
JOIN users u ON p.input_by = u.user_id
WHERE p.type_id = 2
ORDER BY p.created_at DESC;

SELECT * FROM proposals;
SELECT * FROM hibah_details;


