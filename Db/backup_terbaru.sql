PGDMP  1    6                }            kesra_gubsu    17.5    17.5 j    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    20353    kesra_gubsu    DATABASE     �   CREATE DATABASE kesra_gubsu WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE kesra_gubsu;
                     postgres    false                        3079    20354 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            �           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    2            �           1247    20628    enum_attachments_kind    TYPE     s   CREATE TYPE public.enum_attachments_kind AS ENUM (
    'surat_permohonan',
    'rab',
    'permohonan_beasiswa'
);
 (   DROP TYPE public.enum_attachments_kind;
       public               postgres    false            �           1247    20605 	   file_kind    TYPE     g   CREATE TYPE public.file_kind AS ENUM (
    'surat_permohonan',
    'rab',
    'permohonan_beasiswa'
);
    DROP TYPE public.file_kind;
       public               postgres    false            �            1259    20512    academic_levels    TABLE     u   CREATE TABLE public.academic_levels (
    lev_id integer NOT NULL,
    description character varying(50) NOT NULL
);
 #   DROP TABLE public.academic_levels;
       public         heap r       postgres    false            �            1259    20511    academic_levels_lev_id_seq    SEQUENCE     �   ALTER TABLE public.academic_levels ALTER COLUMN lev_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.academic_levels_lev_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               postgres    false    234            �            1259    20381    admins    TABLE     �  CREATE TABLE public.admins (
    admin_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    full_name character varying(255) NOT NULL,
    gender character varying(20) NOT NULL,
    phone_number character varying(20) NOT NULL,
    suspend boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT admins_gender_check CHECK (((gender)::text = ANY ((ARRAY['Pria'::character varying, 'Wanita'::character varying])::text[])))
);
    DROP TABLE public.admins;
       public         heap r       postgres    false    2            �            1259    20612    attachments    TABLE       CREATE TABLE public.attachments (
    attach_id integer NOT NULL,
    proposal_id uuid NOT NULL,
    kind public.file_kind NOT NULL,
    file_name text,
    file_path text,
    file_size integer,
    uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.attachments;
       public         heap r       postgres    false    925            �            1259    20611    attachments_attach_id_seq    SEQUENCE     �   ALTER TABLE public.attachments ALTER COLUMN attach_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.attachments_attach_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               postgres    false    241            �            1259    20587    beasiswa_details    TABLE     �   CREATE TABLE public.beasiswa_details (
    proposal_id uuid NOT NULL,
    univ_name text NOT NULL,
    academic_level integer NOT NULL,
    scan_permohonan_path text NOT NULL
);
 $   DROP TABLE public.beasiswa_details;
       public         heap r       postgres    false            �            1259    20566    hibah_details    TABLE     8  CREATE TABLE public.hibah_details (
    proposal_id uuid NOT NULL,
    sub_id integer NOT NULL,
    nomor_sekda character varying(50),
    tgl_nomor_sekda date,
    nomor_gubernur character varying(50),
    tgl_nomor_gubernur date,
    nama_pengurus text NOT NULL,
    nominal_anggaran numeric(18,2) NOT NULL
);
 !   DROP TABLE public.hibah_details;
       public         heap r       postgres    false            �            1259    20499    hibah_sub_categories    TABLE     x   CREATE TABLE public.hibah_sub_categories (
    sub_id integer NOT NULL,
    type_id integer,
    named text NOT NULL
);
 (   DROP TABLE public.hibah_sub_categories;
       public         heap r       postgres    false            �            1259    20498    hibah_sub_categories_sub_id_seq    SEQUENCE     �   ALTER TABLE public.hibah_sub_categories ALTER COLUMN sub_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hibah_sub_categories_sub_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               postgres    false    232            �            1259    20440    incoming_mail    TABLE     �   CREATE TABLE public.incoming_mail (
    mail_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    mail_no text NOT NULL,
    mail_file text NOT NULL,
    input_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    input_by_admin_id uuid
);
 !   DROP TABLE public.incoming_mail;
       public         heap r       postgres    false    2            �            1259    20454    outgoing_mail    TABLE     �   CREATE TABLE public.outgoing_mail (
    mail_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    mail_no text NOT NULL,
    mail_file text NOT NULL,
    input_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    input_by_admin_id uuid
);
 !   DROP TABLE public.outgoing_mail;
       public         heap r       postgres    false    2            �            1259    20520    proposal_progress    TABLE     k   CREATE TABLE public.proposal_progress (
    progress_id integer NOT NULL,
    description text NOT NULL
);
 %   DROP TABLE public.proposal_progress;
       public         heap r       postgres    false            �            1259    20519 !   proposal_progress_progress_id_seq    SEQUENCE     �   ALTER TABLE public.proposal_progress ALTER COLUMN progress_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.proposal_progress_progress_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               postgres    false    236            �            1259    20491    proposal_types    TABLE     ^   CREATE TABLE public.proposal_types (
    type_id integer NOT NULL,
    named text NOT NULL
);
 "   DROP TABLE public.proposal_types;
       public         heap r       postgres    false            �            1259    20490    proposal_types_type_id_seq    SEQUENCE     �   ALTER TABLE public.proposal_types ALTER COLUMN type_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.proposal_types_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               postgres    false    230            �            1259    20527 	   proposals    TABLE     .  CREATE TABLE public.proposals (
    proposal_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type_id integer,
    nomor_tu character varying(100),
    regencies_id integer,
    address text NOT NULL,
    surat_from text NOT NULL,
    nomor_surat character varying(100) NOT NULL,
    tanggal_surat date NOT NULL,
    perihal text,
    input_by uuid,
    input_by_admin uuid,
    progress integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.proposals;
       public         heap r       postgres    false    2            �            1259    20469 	   provinces    TABLE     p   CREATE TABLE public.provinces (
    provinces_id integer NOT NULL,
    named character varying(100) NOT NULL
);
    DROP TABLE public.provinces;
       public         heap r       postgres    false            �            1259    20468    provinces_provinces_id_seq    SEQUENCE     �   ALTER TABLE public.provinces ALTER COLUMN provinces_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.provinces_provinces_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               postgres    false    226            �            1259    20477 	   regencies    TABLE     J  CREATE TABLE public.regencies (
    regencies_id integer NOT NULL,
    province_id integer NOT NULL,
    named character varying(100) NOT NULL,
    type character varying(10) NOT NULL,
    CONSTRAINT regencies_type_check CHECK (((type)::text = ANY ((ARRAY['Kabupaten'::character varying, 'Kota'::character varying])::text[])))
);
    DROP TABLE public.regencies;
       public         heap r       postgres    false            �            1259    20476    regencies_regencies_id_seq    SEQUENCE     �   ALTER TABLE public.regencies ALTER COLUMN regencies_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.regencies_regencies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               postgres    false    228            �            1259    20365    super_admin    TABLE     �  CREATE TABLE public.super_admin (
    super_admin_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    full_name character varying(255) NOT NULL,
    phone_number character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.super_admin;
       public         heap r       postgres    false    2            �            1259    20424    user_profiles    TABLE     f  CREATE TABLE public.user_profiles (
    profile_id integer NOT NULL,
    user_id uuid NOT NULL,
    birth_date date,
    phone_number character varying(20),
    profile_photo text,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
 !   DROP TABLE public.user_profiles;
       public         heap r       postgres    false            �            1259    20423    user_profiles_profile_id_seq    SEQUENCE     �   ALTER TABLE public.user_profiles ALTER COLUMN profile_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_profiles_profile_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               postgres    false    222            �            1259    20399    users    TABLE     9  CREATE TABLE public.users (
    user_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    nik character varying(35) NOT NULL,
    full_name character varying(255) NOT NULL,
    gender character varying(20) NOT NULL,
    address text NOT NULL,
    id_card_photo text NOT NULL,
    is_verified boolean DEFAULT false,
    verified_at timestamp with time zone,
    verified_by_admin_id uuid,
    suspend boolean DEFAULT false,
    register_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_gender_check CHECK (((gender)::text = ANY ((ARRAY['Pria'::character varying, 'Wanita'::character varying])::text[])))
);
    DROP TABLE public.users;
       public         heap r       postgres    false    2            �          0    20512    academic_levels 
   TABLE DATA           >   COPY public.academic_levels (lev_id, description) FROM stdin;
    public               postgres    false    234   ��       �          0    20381    admins 
   TABLE DATA           �   COPY public.admins (admin_id, username, email, password_hash, full_name, gender, phone_number, suspend, created_at, updated_at) FROM stdin;
    public               postgres    false    219   �       �          0    20612    attachments 
   TABLE DATA           q   COPY public.attachments (attach_id, proposal_id, kind, file_name, file_path, file_size, uploaded_at) FROM stdin;
    public               postgres    false    241   ��       �          0    20587    beasiswa_details 
   TABLE DATA           h   COPY public.beasiswa_details (proposal_id, univ_name, academic_level, scan_permohonan_path) FROM stdin;
    public               postgres    false    239   ��       �          0    20566    hibah_details 
   TABLE DATA           �   COPY public.hibah_details (proposal_id, sub_id, nomor_sekda, tgl_nomor_sekda, nomor_gubernur, tgl_nomor_gubernur, nama_pengurus, nominal_anggaran) FROM stdin;
    public               postgres    false    238   ��       �          0    20499    hibah_sub_categories 
   TABLE DATA           F   COPY public.hibah_sub_categories (sub_id, type_id, named) FROM stdin;
    public               postgres    false    232   �       �          0    20440    incoming_mail 
   TABLE DATA           a   COPY public.incoming_mail (mail_id, mail_no, mail_file, input_at, input_by_admin_id) FROM stdin;
    public               postgres    false    223   L�       �          0    20454    outgoing_mail 
   TABLE DATA           a   COPY public.outgoing_mail (mail_id, mail_no, mail_file, input_at, input_by_admin_id) FROM stdin;
    public               postgres    false    224   i�       �          0    20520    proposal_progress 
   TABLE DATA           E   COPY public.proposal_progress (progress_id, description) FROM stdin;
    public               postgres    false    236   ��       �          0    20491    proposal_types 
   TABLE DATA           8   COPY public.proposal_types (type_id, named) FROM stdin;
    public               postgres    false    230   ��       �          0    20527 	   proposals 
   TABLE DATA           �   COPY public.proposals (proposal_id, type_id, nomor_tu, regencies_id, address, surat_from, nomor_surat, tanggal_surat, perihal, input_by, input_by_admin, progress, created_at, updated_at) FROM stdin;
    public               postgres    false    237   �       �          0    20469 	   provinces 
   TABLE DATA           8   COPY public.provinces (provinces_id, named) FROM stdin;
    public               postgres    false    226   ��       �          0    20477 	   regencies 
   TABLE DATA           K   COPY public.regencies (regencies_id, province_id, named, type) FROM stdin;
    public               postgres    false    228   ��       �          0    20365    super_admin 
   TABLE DATA           �   COPY public.super_admin (super_admin_id, username, email, password_hash, full_name, phone_number, created_at, updated_at) FROM stdin;
    public               postgres    false    218   %�       �          0    20424    user_profiles 
   TABLE DATA           �   COPY public.user_profiles (profile_id, user_id, birth_date, phone_number, profile_photo, last_login, created_at, updated_at) FROM stdin;
    public               postgres    false    222   �       �          0    20399    users 
   TABLE DATA           �   COPY public.users (user_id, username, email, password_hash, nik, full_name, gender, address, id_card_photo, is_verified, verified_at, verified_by_admin_id, suspend, register_at, updated_at) FROM stdin;
    public               postgres    false    220   �       �           0    0    academic_levels_lev_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.academic_levels_lev_id_seq', 3, true);
          public               postgres    false    233            �           0    0    attachments_attach_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.attachments_attach_id_seq', 2, true);
          public               postgres    false    240            �           0    0    hibah_sub_categories_sub_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.hibah_sub_categories_sub_id_seq', 3, true);
          public               postgres    false    231            �           0    0 !   proposal_progress_progress_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.proposal_progress_progress_id_seq', 4, true);
          public               postgres    false    235            �           0    0    proposal_types_type_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.proposal_types_type_id_seq', 2, true);
          public               postgres    false    229            �           0    0    provinces_provinces_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.provinces_provinces_id_seq', 1, true);
          public               postgres    false    225            �           0    0    regencies_regencies_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.regencies_regencies_id_seq', 33, true);
          public               postgres    false    227            �           0    0    user_profiles_profile_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.user_profiles_profile_id_seq', 1, false);
          public               postgres    false    221            !           2606    20518 /   academic_levels academic_levels_description_key 
   CONSTRAINT     q   ALTER TABLE ONLY public.academic_levels
    ADD CONSTRAINT academic_levels_description_key UNIQUE (description);
 Y   ALTER TABLE ONLY public.academic_levels DROP CONSTRAINT academic_levels_description_key;
       public                 postgres    false    234            #           2606    20516 $   academic_levels academic_levels_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.academic_levels
    ADD CONSTRAINT academic_levels_pkey PRIMARY KEY (lev_id);
 N   ALTER TABLE ONLY public.academic_levels DROP CONSTRAINT academic_levels_pkey;
       public                 postgres    false    234            �           2606    20396    admins admins_email_key 
   CONSTRAINT     S   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);
 A   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_email_key;
       public                 postgres    false    219            �           2606    20398    admins admins_phone_number_key 
   CONSTRAINT     a   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_phone_number_key UNIQUE (phone_number);
 H   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_phone_number_key;
       public                 postgres    false    219                        2606    20392    admins admins_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);
 <   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_pkey;
       public                 postgres    false    219                       2606    20394    admins admins_username_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);
 D   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_username_key;
       public                 postgres    false    219            5           2606    20619    attachments attachments_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (attach_id);
 F   ALTER TABLE ONLY public.attachments DROP CONSTRAINT attachments_pkey;
       public                 postgres    false    241            3           2606    20593 &   beasiswa_details beasiswa_details_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public.beasiswa_details
    ADD CONSTRAINT beasiswa_details_pkey PRIMARY KEY (proposal_id);
 P   ALTER TABLE ONLY public.beasiswa_details DROP CONSTRAINT beasiswa_details_pkey;
       public                 postgres    false    239            -           2606    20576 .   hibah_details hibah_details_nomor_gubernur_key 
   CONSTRAINT     s   ALTER TABLE ONLY public.hibah_details
    ADD CONSTRAINT hibah_details_nomor_gubernur_key UNIQUE (nomor_gubernur);
 X   ALTER TABLE ONLY public.hibah_details DROP CONSTRAINT hibah_details_nomor_gubernur_key;
       public                 postgres    false    238            /           2606    20574 +   hibah_details hibah_details_nomor_sekda_key 
   CONSTRAINT     m   ALTER TABLE ONLY public.hibah_details
    ADD CONSTRAINT hibah_details_nomor_sekda_key UNIQUE (nomor_sekda);
 U   ALTER TABLE ONLY public.hibah_details DROP CONSTRAINT hibah_details_nomor_sekda_key;
       public                 postgres    false    238            1           2606    20572     hibah_details hibah_details_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.hibah_details
    ADD CONSTRAINT hibah_details_pkey PRIMARY KEY (proposal_id);
 J   ALTER TABLE ONLY public.hibah_details DROP CONSTRAINT hibah_details_pkey;
       public                 postgres    false    238                       2606    20505 .   hibah_sub_categories hibah_sub_categories_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.hibah_sub_categories
    ADD CONSTRAINT hibah_sub_categories_pkey PRIMARY KEY (sub_id);
 X   ALTER TABLE ONLY public.hibah_sub_categories DROP CONSTRAINT hibah_sub_categories_pkey;
       public                 postgres    false    232                       2606    20448     incoming_mail incoming_mail_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.incoming_mail
    ADD CONSTRAINT incoming_mail_pkey PRIMARY KEY (mail_id);
 J   ALTER TABLE ONLY public.incoming_mail DROP CONSTRAINT incoming_mail_pkey;
       public                 postgres    false    223                       2606    20462     outgoing_mail outgoing_mail_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.outgoing_mail
    ADD CONSTRAINT outgoing_mail_pkey PRIMARY KEY (mail_id);
 J   ALTER TABLE ONLY public.outgoing_mail DROP CONSTRAINT outgoing_mail_pkey;
       public                 postgres    false    224            %           2606    20526 (   proposal_progress proposal_progress_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public.proposal_progress
    ADD CONSTRAINT proposal_progress_pkey PRIMARY KEY (progress_id);
 R   ALTER TABLE ONLY public.proposal_progress DROP CONSTRAINT proposal_progress_pkey;
       public                 postgres    false    236                       2606    20497 "   proposal_types proposal_types_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.proposal_types
    ADD CONSTRAINT proposal_types_pkey PRIMARY KEY (type_id);
 L   ALTER TABLE ONLY public.proposal_types DROP CONSTRAINT proposal_types_pkey;
       public                 postgres    false    230            '           2606    20540 #   proposals proposals_nomor_surat_key 
   CONSTRAINT     e   ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_nomor_surat_key UNIQUE (nomor_surat);
 M   ALTER TABLE ONLY public.proposals DROP CONSTRAINT proposals_nomor_surat_key;
       public                 postgres    false    237            )           2606    20538     proposals proposals_nomor_tu_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_nomor_tu_key UNIQUE (nomor_tu);
 J   ALTER TABLE ONLY public.proposals DROP CONSTRAINT proposals_nomor_tu_key;
       public                 postgres    false    237            +           2606    20536    proposals proposals_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (proposal_id);
 B   ALTER TABLE ONLY public.proposals DROP CONSTRAINT proposals_pkey;
       public                 postgres    false    237                       2606    20475    provinces provinces_named_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_named_key UNIQUE (named);
 G   ALTER TABLE ONLY public.provinces DROP CONSTRAINT provinces_named_key;
       public                 postgres    false    226                       2606    20473    provinces provinces_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (provinces_id);
 B   ALTER TABLE ONLY public.provinces DROP CONSTRAINT provinces_pkey;
       public                 postgres    false    226                       2606    20482    regencies regencies_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.regencies
    ADD CONSTRAINT regencies_pkey PRIMARY KEY (regencies_id);
 B   ALTER TABLE ONLY public.regencies DROP CONSTRAINT regencies_pkey;
       public                 postgres    false    228                       2606    20484 )   regencies regencies_province_id_named_key 
   CONSTRAINT     r   ALTER TABLE ONLY public.regencies
    ADD CONSTRAINT regencies_province_id_named_key UNIQUE (province_id, named);
 S   ALTER TABLE ONLY public.regencies DROP CONSTRAINT regencies_province_id_named_key;
       public                 postgres    false    228    228            �           2606    20378 !   super_admin super_admin_email_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.super_admin
    ADD CONSTRAINT super_admin_email_key UNIQUE (email);
 K   ALTER TABLE ONLY public.super_admin DROP CONSTRAINT super_admin_email_key;
       public                 postgres    false    218            �           2606    20380 (   super_admin super_admin_phone_number_key 
   CONSTRAINT     k   ALTER TABLE ONLY public.super_admin
    ADD CONSTRAINT super_admin_phone_number_key UNIQUE (phone_number);
 R   ALTER TABLE ONLY public.super_admin DROP CONSTRAINT super_admin_phone_number_key;
       public                 postgres    false    218            �           2606    20374    super_admin super_admin_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.super_admin
    ADD CONSTRAINT super_admin_pkey PRIMARY KEY (super_admin_id);
 F   ALTER TABLE ONLY public.super_admin DROP CONSTRAINT super_admin_pkey;
       public                 postgres    false    218            �           2606    20376 $   super_admin super_admin_username_key 
   CONSTRAINT     c   ALTER TABLE ONLY public.super_admin
    ADD CONSTRAINT super_admin_username_key UNIQUE (username);
 N   ALTER TABLE ONLY public.super_admin DROP CONSTRAINT super_admin_username_key;
       public                 postgres    false    218                       2606    20432     user_profiles user_profiles_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (profile_id);
 J   ALTER TABLE ONLY public.user_profiles DROP CONSTRAINT user_profiles_pkey;
       public                 postgres    false    222                       2606    20434 '   user_profiles user_profiles_user_id_key 
   CONSTRAINT     e   ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
 Q   ALTER TABLE ONLY public.user_profiles DROP CONSTRAINT user_profiles_user_id_key;
       public                 postgres    false    222                       2606    20415    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    220                       2606    20417    users users_nik_key 
   CONSTRAINT     M   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_nik_key UNIQUE (nik);
 =   ALTER TABLE ONLY public.users DROP CONSTRAINT users_nik_key;
       public                 postgres    false    220                       2606    20411    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    220            
           2606    20413    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public                 postgres    false    220                       1259    20626    regencies_province_id_named    INDEX     f   CREATE UNIQUE INDEX regencies_province_id_named ON public.regencies USING btree (province_id, named);
 /   DROP INDEX public.regencies_province_id_named;
       public                 postgres    false    228    228            E           2606    20620 (   attachments attachments_proposal_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.proposals(proposal_id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.attachments DROP CONSTRAINT attachments_proposal_id_fkey;
       public               postgres    false    237    4907    241            C           2606    20599 5   beasiswa_details beasiswa_details_academic_level_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.beasiswa_details
    ADD CONSTRAINT beasiswa_details_academic_level_fkey FOREIGN KEY (academic_level) REFERENCES public.academic_levels(lev_id);
 _   ALTER TABLE ONLY public.beasiswa_details DROP CONSTRAINT beasiswa_details_academic_level_fkey;
       public               postgres    false    239    234    4899            D           2606    20594 2   beasiswa_details beasiswa_details_proposal_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.beasiswa_details
    ADD CONSTRAINT beasiswa_details_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.proposals(proposal_id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.beasiswa_details DROP CONSTRAINT beasiswa_details_proposal_id_fkey;
       public               postgres    false    239    237    4907            A           2606    20577 ,   hibah_details hibah_details_proposal_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.hibah_details
    ADD CONSTRAINT hibah_details_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.proposals(proposal_id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.hibah_details DROP CONSTRAINT hibah_details_proposal_id_fkey;
       public               postgres    false    4907    237    238            B           2606    20582 '   hibah_details hibah_details_sub_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.hibah_details
    ADD CONSTRAINT hibah_details_sub_id_fkey FOREIGN KEY (sub_id) REFERENCES public.hibah_sub_categories(sub_id);
 Q   ALTER TABLE ONLY public.hibah_details DROP CONSTRAINT hibah_details_sub_id_fkey;
       public               postgres    false    238    232    4895            ;           2606    20506 6   hibah_sub_categories hibah_sub_categories_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.hibah_sub_categories
    ADD CONSTRAINT hibah_sub_categories_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.proposal_types(type_id) ON DELETE SET NULL;
 `   ALTER TABLE ONLY public.hibah_sub_categories DROP CONSTRAINT hibah_sub_categories_type_id_fkey;
       public               postgres    false    232    4893    230            8           2606    20449 2   incoming_mail incoming_mail_input_by_admin_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.incoming_mail
    ADD CONSTRAINT incoming_mail_input_by_admin_id_fkey FOREIGN KEY (input_by_admin_id) REFERENCES public.admins(admin_id) ON DELETE SET NULL;
 \   ALTER TABLE ONLY public.incoming_mail DROP CONSTRAINT incoming_mail_input_by_admin_id_fkey;
       public               postgres    false    223    4864    219            9           2606    20463 2   outgoing_mail outgoing_mail_input_by_admin_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.outgoing_mail
    ADD CONSTRAINT outgoing_mail_input_by_admin_id_fkey FOREIGN KEY (input_by_admin_id) REFERENCES public.admins(admin_id) ON DELETE SET NULL;
 \   ALTER TABLE ONLY public.outgoing_mail DROP CONSTRAINT outgoing_mail_input_by_admin_id_fkey;
       public               postgres    false    224    219    4864            <           2606    20556 '   proposals proposals_input_by_admin_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_input_by_admin_fkey FOREIGN KEY (input_by_admin) REFERENCES public.admins(admin_id) ON DELETE SET NULL;
 Q   ALTER TABLE ONLY public.proposals DROP CONSTRAINT proposals_input_by_admin_fkey;
       public               postgres    false    219    237    4864            =           2606    20551 !   proposals proposals_input_by_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_input_by_fkey FOREIGN KEY (input_by) REFERENCES public.users(user_id) ON DELETE SET NULL;
 K   ALTER TABLE ONLY public.proposals DROP CONSTRAINT proposals_input_by_fkey;
       public               postgres    false    4872    220    237            >           2606    20561 !   proposals proposals_progress_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_progress_fkey FOREIGN KEY (progress) REFERENCES public.proposal_progress(progress_id) ON DELETE SET NULL;
 K   ALTER TABLE ONLY public.proposals DROP CONSTRAINT proposals_progress_fkey;
       public               postgres    false    237    4901    236            ?           2606    20546 %   proposals proposals_regencies_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_regencies_id_fkey FOREIGN KEY (regencies_id) REFERENCES public.regencies(regencies_id);
 O   ALTER TABLE ONLY public.proposals DROP CONSTRAINT proposals_regencies_id_fkey;
       public               postgres    false    4888    228    237            @           2606    20541     proposals proposals_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.proposal_types(type_id);
 J   ALTER TABLE ONLY public.proposals DROP CONSTRAINT proposals_type_id_fkey;
       public               postgres    false    237    4893    230            :           2606    20485 $   regencies regencies_province_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.regencies
    ADD CONSTRAINT regencies_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(provinces_id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.regencies DROP CONSTRAINT regencies_province_id_fkey;
       public               postgres    false    226    228    4886            7           2606    20435 (   user_profiles user_profiles_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.user_profiles DROP CONSTRAINT user_profiles_user_id_fkey;
       public               postgres    false    4872    220    222            6           2606    20418 %   users users_verified_by_admin_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_verified_by_admin_id_fkey FOREIGN KEY (verified_by_admin_id) REFERENCES public.admins(admin_id) ON DELETE SET NULL;
 O   ALTER TABLE ONLY public.users DROP CONSTRAINT users_verified_by_admin_id_fkey;
       public               postgres    false    219    220    4864            �      x�3�6�2�6�2�6����� !�      �   �   x�}̻�0��<��)9�-�8�1��Kb�%.��E��^]��ɇFr&Q�$AEʔZ'���4�Qqȉueq�m�ß��-�k$���,���^���g3�Ө�\p潾՗�*/���[��ٶU+d�_ŊD_u0��d����ȸ��HF���������@9�gy���7�>=�      �   �   x����j�0E��Wx���C�D��nJ���M�m�����B!�.�.�;�3� '8��K�N~2�<�Z`�� ���c��a����qVo1/H�:^r�Z&u��%�}�����b�]���c��z�#��kٹS� �8�_�,T��O�A���5o�Լ&U��+ec��Dv��1zo'��lH��%���H�\�?��gl��=�Z�;g~�      �   �   x��λN�0@�:�
z4�<����E��؁H��,�O��Zh�nq���b,D���1a��Kʁf�:w�u�(G[�c{�Լ����Qw�߶��8�9�i/�u{�j����u��<1��@�D����τ8b1~��Ko}�sN�2�)a�� �8Mb89�+X���~���}����q&��"pI�(��!9p���²�3��i1_8�����ơ��O��      �   q   x�3HN2�H17�5L1K�5I�LӵHN5��I���ƜF�1~䘑���\��QPZR��ij z\)I��Ɖ@�����uM���u�M��ZZ��Z�b\� q(�      �   9   x�3�4�H�K�L��N��2r�Js3<�S3���ީ9��I��@1z\\\ ���      �      x������ � �      �      x������ � �      �   "   x�3�42�2�46�2�47�2�440������ 0��      �       x�3���LJ��2�tJM,�,.O����� R�=      �   �  x���Mo�@���W����짏�AE)�J��~�Sű�7ԀP�����������fAw�����,.�tI� �����MS�#���]S���fw�zU6���㑇�^��qd!%.�V˅���c�@�X��v�i7����4��2�>�_x����s�Flɴ�6����U9�D<�H�Z����0�a�_.����������
�)�����6��8��(�(ؕ�&�}Jt{#脺���4�T�z��Nb9�^�C?��\�T��� ��~<r�Vh�l��s�eT�M�QC�J�.�7g����8�$Z�������
l5ָ+����]&� ���II�!Z��S�"E�Y�/f�90XR=���U�-�YK(�=Q
.�"5�����uU�MUU�d�&      �      x�3�.�M,I-JT-I,J����� P�L      �   X  x�e��n�0���)x��@�$ǢH��E
��2�qb[}���lrA�7�wv��"Y|���,(]+L��a]����3�;�Nyl�Lh_EW�HOZ��wuI4ޣw�r6��At��ք�t"C%9�M�P?�����ۆ���������'�
J+�z�k��sg��g�Ȇ��ۖ��j0YMڋ5��0>�7쵞i�o��G�G���8�+�W��cc�Y��
�ZS�jhg��Q��q���C����H�|y���IRN�hʀq6�2w6�XD)��9�m�9�Mb���?�^U�nݤd<�E��4r1*ϱ�FK��9��S�z�S��LA9�(�� �      �   �   x�}̻
�0��9}��$��4��I���B+���I-^���O/.�n?|�[%�:��
0�ri-�N!\5�?0��q��#c�7/���&�׎D��"Y��,��v�5�j1��U��Rl�lS�t��B?��;���rW�Ð����3Rd	R�&((�"� G��9��?�� >�56�      �      x������ � �      �      x������ � �     