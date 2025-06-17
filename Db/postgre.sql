CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; --jalankan 1x saja untuk mengaktifkan ekstensi UUID

CREATE TABLE admins (
    admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL, 
	email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
	gender VARCHAR(20) NOT NULL CHECK (gender IN ('Pria', 'Wanita')),
	phone_number VARCHAR(20) NOT NULL,
    nip VARCHAR(25) UNIQUE NOT NULL, --nomor induk pegawai
    positions VARCHAR(100), --jabatan
    address TEXT NOT NULL,
	suspend BOOLEAN DEFAULT FALSE, --digunakan untuk menonaktifkan admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nik VARCHAR(35) UNIQUE NOT NULL, --nomor induk kependudukan
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Pria', 'Wanita')),
    address VARCHAR(255) NOT NULL,
    id_card_photo TEXT NOT NULL, --foto ktp
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP, --waktu verifikasi oleh admin
    verified_by_admin_id UUID REFERENCES admins(admin_id) ON DELETE SET NULL,
    suspend BOOLEAN DEFAULT FALSE, --digunakan untuk menonaktifkan user
    register_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    profile_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    birth_date DATE,
    phone_number VARCHAR(20),
    profile_photo TEXT,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE incoming_mail(
	mail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	mail_no TEXT NOT NULL,
	mail_file TEXT NOT NULL,
	input_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	input_by_admin_id UUID REFERENCES admins(admin_id) ON DELETE SET NULL
);

CREATE TABLE outgoing_mail(
	mail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	mail_no TEXT NOT NULL,
	mail_file TEXT NOT NULL,
	input_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	input_by_admin_id UUID REFERENCES admins(admin_id) ON DELETE SET NULL
);

select * from admins;
select * from users;
