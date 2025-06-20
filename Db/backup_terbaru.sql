PGDMP      %                }            kesra_gubsu    17.5    17.5 "    g           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            h           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            i           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            j           1262    16808    kesra_gubsu    DATABASE     �   CREATE DATABASE kesra_gubsu WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE kesra_gubsu;
                     postgres    false                        3079    16976 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            k           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    2            �            1259    17151    admins    TABLE     
  CREATE TABLE public.admins (
    admin_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    full_name character varying(255) NOT NULL,
    gender character varying(20) NOT NULL,
    phone_number character varying(20) NOT NULL,
    nip character varying(25) NOT NULL,
    positions character varying(100) NOT NULL,
    address text NOT NULL,
    suspend boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT admins_gender_check CHECK (((gender)::text = ANY ((ARRAY['Pria'::character varying, 'Wanita'::character varying])::text[])))
);
    DROP TABLE public.admins;
       public         heap r       postgres    false    2            �            1259    17209    incoming_mail    TABLE     �   CREATE TABLE public.incoming_mail (
    mail_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    mail_no text NOT NULL,
    mail_file text NOT NULL,
    input_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    input_by_admin_id uuid
);
 !   DROP TABLE public.incoming_mail;
       public         heap r       postgres    false    2            �            1259    17223    outgoing_mail    TABLE     �   CREATE TABLE public.outgoing_mail (
    mail_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    mail_no text NOT NULL,
    mail_file text NOT NULL,
    input_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    input_by_admin_id uuid
);
 !   DROP TABLE public.outgoing_mail;
       public         heap r       postgres    false    2            �            1259    17193    user_profiles    TABLE     f  CREATE TABLE public.user_profiles (
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
       public         heap r       postgres    false            �            1259    17192    user_profiles_profile_id_seq    SEQUENCE     �   ALTER TABLE public.user_profiles ALTER COLUMN profile_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_profiles_profile_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               postgres    false    221            �            1259    17168    users    TABLE     K  CREATE TABLE public.users (
    user_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    nik character varying(35) NOT NULL,
    full_name character varying(255) NOT NULL,
    gender character varying(20) NOT NULL,
    address character varying(255) NOT NULL,
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
       public         heap r       postgres    false    2            _          0    17151    admins 
   TABLE DATA           �   COPY public.admins (admin_id, username, email, password_hash, full_name, gender, phone_number, nip, positions, address, suspend, created_at, updated_at) FROM stdin;
    public               postgres    false    218   �0       c          0    17209    incoming_mail 
   TABLE DATA           a   COPY public.incoming_mail (mail_id, mail_no, mail_file, input_at, input_by_admin_id) FROM stdin;
    public               postgres    false    222   �2       d          0    17223    outgoing_mail 
   TABLE DATA           a   COPY public.outgoing_mail (mail_id, mail_no, mail_file, input_at, input_by_admin_id) FROM stdin;
    public               postgres    false    223   99       b          0    17193    user_profiles 
   TABLE DATA           �   COPY public.user_profiles (profile_id, user_id, birth_date, phone_number, profile_photo, last_login, created_at, updated_at) FROM stdin;
    public               postgres    false    221   �?       `          0    17168    users 
   TABLE DATA           �   COPY public.users (user_id, username, email, password_hash, nik, full_name, gender, address, id_card_photo, is_verified, verified_at, verified_by_admin_id, suspend, register_at, updated_at) FROM stdin;
    public               postgres    false    219   TD       l           0    0    user_profiles_profile_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.user_profiles_profile_id_seq', 29, true);
          public               postgres    false    220            �           2606    17165    admins admins_email_key 
   CONSTRAINT     S   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);
 A   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_email_key;
       public                 postgres    false    218            �           2606    17167    admins admins_nip_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_nip_key UNIQUE (nip);
 ?   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_nip_key;
       public                 postgres    false    218            �           2606    17161    admins admins_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);
 <   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_pkey;
       public                 postgres    false    218            �           2606    17163    admins admins_username_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);
 D   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_username_key;
       public                 postgres    false    218            �           2606    17217     incoming_mail incoming_mail_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.incoming_mail
    ADD CONSTRAINT incoming_mail_pkey PRIMARY KEY (mail_id);
 J   ALTER TABLE ONLY public.incoming_mail DROP CONSTRAINT incoming_mail_pkey;
       public                 postgres    false    222            �           2606    17231     outgoing_mail outgoing_mail_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.outgoing_mail
    ADD CONSTRAINT outgoing_mail_pkey PRIMARY KEY (mail_id);
 J   ALTER TABLE ONLY public.outgoing_mail DROP CONSTRAINT outgoing_mail_pkey;
       public                 postgres    false    223            �           2606    17201     user_profiles user_profiles_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (profile_id);
 J   ALTER TABLE ONLY public.user_profiles DROP CONSTRAINT user_profiles_pkey;
       public                 postgres    false    221            �           2606    17203 '   user_profiles user_profiles_user_id_key 
   CONSTRAINT     e   ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
 Q   ALTER TABLE ONLY public.user_profiles DROP CONSTRAINT user_profiles_user_id_key;
       public                 postgres    false    221            �           2606    17184    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    219            �           2606    17186    users users_nik_key 
   CONSTRAINT     M   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_nik_key UNIQUE (nik);
 =   ALTER TABLE ONLY public.users DROP CONSTRAINT users_nik_key;
       public                 postgres    false    219            �           2606    17180    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    219            �           2606    17182    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public                 postgres    false    219            �           2606    17218 2   incoming_mail incoming_mail_input_by_admin_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.incoming_mail
    ADD CONSTRAINT incoming_mail_input_by_admin_id_fkey FOREIGN KEY (input_by_admin_id) REFERENCES public.admins(admin_id) ON DELETE SET NULL;
 \   ALTER TABLE ONLY public.incoming_mail DROP CONSTRAINT incoming_mail_input_by_admin_id_fkey;
       public               postgres    false    218    222    4791            �           2606    17232 2   outgoing_mail outgoing_mail_input_by_admin_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.outgoing_mail
    ADD CONSTRAINT outgoing_mail_input_by_admin_id_fkey FOREIGN KEY (input_by_admin_id) REFERENCES public.admins(admin_id) ON DELETE SET NULL;
 \   ALTER TABLE ONLY public.outgoing_mail DROP CONSTRAINT outgoing_mail_input_by_admin_id_fkey;
       public               postgres    false    223    218    4791            �           2606    17204 (   user_profiles user_profiles_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.user_profiles DROP CONSTRAINT user_profiles_user_id_fkey;
       public               postgres    false    4799    219    221            �           2606    17187 %   users users_verified_by_admin_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_verified_by_admin_id_fkey FOREIGN KEY (verified_by_admin_id) REFERENCES public.admins(admin_id) ON DELETE SET NULL;
 O   ALTER TABLE ONLY public.users DROP CONSTRAINT users_verified_by_admin_id_fkey;
       public               postgres    false    4791    219    218            _     x���Oo�0��ɧȡ��Ư�86����&��et���v%�	�B?���vH�i�,����m=�m�0�#
Y�q���eH0�9ZF�z����'���bjq>/��� 9��p<�Wyr��Ѹ0��+��R�t�
W]K[y��1w,NJ��.������z��X{@E$9l/�L���y)�o�=�QBCD mޤ
��~ ѯH6�h��H���W�I�,GD�xN8RF����rE��j_�1b�>�5T�=Xޥ�Su�ś��?�]:�[��pr��S�]�o�l��2�_�k]�=3�G�_:�_-l����)R��gAb��!��c�$�A�k}���I9f�|F>i	�u,Y-��e�Q��Ѕ�)���@��1׳y'�˳o����ԮZ����b[RU��x�۝�q�����uy'��_����7#\6`����3�2�"q����J�Pi	�Fޕu�}�E���i�MG�^���,j�n�Oc�ƺ=��7e�<��?w�?����8TG��a�Ǿ��V��      c   y  x��WKS"[^W���O�]�}N�EEQ���M����� �ί����1�*a����R�X2(&HfJ��G��I�����������x�n_6?���u�M�:`�&�:��u����%WPj`�_��(�Ɏ���.M��>��d��D�=h�QJ�֔�Q���d�=H���)����1eU����g.��n�!�W/�T�u}��}�s�L�Z�=8�-�R��Y��y�u�����n2�����0/M�;<���m��s(�w�����b��X�q�,UH`������ݩ�.n>���"<я�kj/�K��::�A��7Xd%M��Fj���N�����+w��\v1�[X��Tǣ���ϱ����8���#�M����i���!�����`��.��;`�ZWM:�q�>ǢMg,2k�.A�h@Z��f&@{�9!�����z㳓�,ۧ���պ��?X,ɸ�`��Y �8A��"�Ƃ�<z��Q��Qoޛ^�z���q��$�fvMZ�HX�㱶3� �t�J@G|�%π:$0[���ף�t��R�F��iIӤ�%��T�뾬�!�6(��Ep���5K�H|9:�]f���6��I�I�F����ED�E4�r8��L���8\*a�D�S�����|���>��v�m�z/��m[�`�Yc��Q�~�L�X�M����
�g�8�ݪ���e�H�U��=m�<�i�9ޝ1�9�R$_�i��`"uY��1I��A���w���^N��ٴ�jlq��N�`B��H�%[�3t)"�rRA���s(�`~<�@6[
�-����l����:"g�nx)d�eME	σ�Yd�8G�,F�����h�����]ڏ��b)|�yBu�� ��2X� ��I�SJ*ˌ���M����^��2V�-u����`��h�ac0�ɹ���ܤ �$*9/Lq�0Z�����������)�٥����O��-*Y� =���L���1 �*b.�����ހ)wU� ����K2�9�e�h6�t�'�:Yz/EJދb��;�xv�ɦZU�I����R|�v���H҇ 1H$Y[.� T��^�2�bq�LfW����w����������FQ�7�C%=TR09n� ڞ��!����g���x?�]M�X�k��~Y��-�C�$���,5�� �T|%�D%����1	�\1r���;]\����6���6���jrݣ����l��L��UN�����L�*����ݜ��� �׮
�p��W<hy����*c6U�����@�:��_�Jb1�-�o���Ǔ�Q��Kj��q�LI}�2�u��Um���R�C����l�d*UYo��d����������&�nY���������S�{��2�l����t�`E
��~�E�����d>?� �ķ�[B�|[��k))��$!(�8u;r9���1ze�����L���bL��#�f�~>lv�w����L�1�-\)BDc�U_/��]��P����%l�T���jz��B9@��R�<s+ �D��6�,AH"n�/�x�y;�^,��vm�	���+%��Ӎ����J��Ӂ΀�a�J�2%��B*�ϥ/.���nrr��ӷ�2UM���)�7���H�s��۷���m�      d   x  x��WIo"I>g������R7�`Ƭ6�K�&g�L$��_��J�e]P
Bɧ��-��q��� .�A�ڈ�����!�����Vٺ��w?��e��oQ�w������b*�������p���U�.a�"����OxrH�d9�V+�qf9	6� RD\���f��%:e�F��m�?y^NH>�����ˀ޷�&�����k4�4F�}������� npTxM"�^^�y�7'4F[T�
v��)�&^����$�	)�\:��E'EV��VYk5~��oW������D�-�����T��j�$�-s)F�R�%)C�	V�D@2�����e:NV��	˺ڽ�uED����\�����8,7���N�y��̆����e�X><��I���ƀR^���M�}�5M#�^�d,C�K`��9��RD��N"[v��UO����,�W���/`1��HK� %��@�a�vE�A:�L�ڝ�������%�mw5�آ��pmG�7�Ӟ*��?��h�j��G���Sk�xZ=�	�6�]U�͙C�o�+��oP��2�8
3�\b%
X��:P��fB<d���,�m�A�u�U]����ɫ!�p��Eq�`0�J$���{��Y�{]�ҳ�n\^�G�)����/�/Ƞ1G�VĄ>:NH�H5�DM3>etԟ��Y�wB��G�M@�:ߢ�=\�A�;p�!�1�p�R�
*8ђi���j8�ϧ�s���;�T宆=�h. ��=��yJ�V����-%&e�E{�ڑ�>�)�_��;�L�����l��*�\QTG�dT����@�	)�T�kA}6��n��{:'B���QE<8���4�$$	�Qim�1'I���E6�����-;[p�`>����ʏ迦sQU���5�k��<�;tP+��)��^z㥚��j�Ӷ���0�����;��/̧9���:iĂ �S��c�3([VQ�̆�Ǖ \����ۣʡ��� ���TcPL'�uH@�JG�M�<��L\�6�<�:�E���g��F���e��T�,ݱ��M��Q�a�R�B8����|�H{�3������_�pG��$Nd$4��8(��h�A�Tz����}7�?�%7��#�mm�î��}����'�p������H
m/PD��Z�PDf���򁌞���P}���m]��/|����7j��Zc
���s�rZk�\$#�C6���/�-�>��$���� �P��.U���je���S/�*�FDO)#F:�����襵|\���Ǿ�qAT�/._Ds�+��:cqsu��<��&Kts��e��<;�j��(�r��m����4�&xm1�@���S<��3V[	�Bq����z��]�t�K�i_�]U|��\+Y76*FA�H��NbD�RcN!��~8y���?�a�<���"i$n�v�H��U� k� �n��CG���}�;g�n��RG�.��z�wW��$ͻ���M�+����WA$�� aU����a��]kp�w�����j[��*z�=�4W8��((|�"4P���Y���8qJ|�f��.���_�H��n_�������Y����ͷo��Y�{�      b   �  x�}����6���St_�o���d�k/h� M}�ғ����o�@�%�a4��9�
� Q�8�^1�*a����?
�"`���q׸e��]H+/�F�I&X���v��XP�h��;��md�z�VYH�R�	b�R�_�c@j���Az�]�&�绲�qh,['�23d�
����\r�W��#m��NZ�b6��4�� -H��*�i���>v[<��Ֆ�R��E�
e��j��b�mP�خ@��l��/@wҚ��E������� y��9:�:�"���Na�E��5/��ce���8A��@��
��H� [H/���fn7kN���X(A��ZyZ�������Z�/�p/��3��YA8�v�Δs͖���e�2��QZ��P��V���A�/���#���+��7�W��$��x���)7�gC�:�p�G�Fy��%���0��GiEY�T��)��!'3y
�8���8̞�Hv�=���t'����>�8����ÃUЙ�thK9^�PwO��{iŸx�L�XO����]^�aEJC�Y��]�ȏ�-�]�(��	�md�|�R�L��BΥM��L�"I�zl�����b"�.u")@�R Ph��W�Iz+F��N��(��sOw�=0mA�A�O%�\�>.r�}���xyK�ϤGi%�i�3i 	;)M�����dNU�M�|�S��i|�<�N�J�������;�{#P����K�o2��������8I+��X��ޡ���ŧ q�V;�Y���v%���_u&�K+�Rh:����O��eu�2���G;�q���gң�z�L-(��_+���C
��أt�����8���[�t&�K�o!4l�(�@��4�;��vR]���w��bP�gң�R\��݀�@r�/^�<�s�H���2�v�1W��t/��D�i�T��k^N�f�޾~B`@�[Ys&]~����_���|��K�n��>�4�}l�}�����������+'���9|���t�X[нD�]�>��Qa/u<�-�,�<�|��gR�;O&�Ў�89+}Z��6���F���K����F�ҕʛ�!����6������������W�4� �Ψ5=��%Q��)mQ��A���<���m]���)      `   Y  x���Ys�����W�üݐ�}��ŀ�����(I%�&��7ew�OO\Mt;i��8u�da%�"��U�9Lp�(�Q��c(�v��n�ㅉ殿Z��$ޟ�9���iߊ��0i���Ig��s.wjˏ��'�ٶR=+�B����&�q!��� ��~H�k����vg���62���~aS��'��j$�0E�V`tG����?H�(��'��X�HOHX��`� �$�4��Th��I�A����2;z���~|X5�ꌵ
�Y�M�+�N�]��Ы|o��ު�-��S��_+��?oy[��LM����	v��%G�H%��J*$�B�z9�������Rn�#B+x[����X�(_[Z�����E
Y�ᘓ�h�?�9��r�哋j���
m��]=Y�5K��<6:?)��Š��C�$�iv��c�eR\����r�(s���P;���	���	m��^1$�5s����ڧ�-ֽS[�˂�j���[�0�'��q�k�IG�|?�ߑ��0��8VT*|�����U�^ ���)����B�P���8J�с�0\��7A�Da���n��&7;�v93zѣ�\�Ux����9�\#?v�^ق}g��-#������,(��ȅ+���XJ�J!��1<1�CGy�s(���#�ʟ,��q������8�M�?>�v�zg��ǧպZ��ֺZ�ֶ&�V�C��ۻgq�����pစSַ̔q�;��K��PI�`����}�'p
N �����1���v7q�á7��Ѝۣ�i:��X|���k2�w�j�=Cm����Emʍ����C��qh��dHK%�����A.b���R�q���:LQ�h�+�+j�o�E�$@�;{I�W��ҡ���ni�i�&d=p_+�z�]��@�'5��ᄵ6=^�/�w$��Dck#�Z�#nK��;D]M�&o�W��У�V�1��a��1�[x%��T!׾��$��Itʺ:��n-ӎ_6�G�V��k�����Y f��W_�=yxi�K6�voP�oR�X��ҷFI�(Z@&�H�C���y�#]�ˇ��CZn�;�"�h?��T{�K�76�8�:�����,��Jy�j-���������4{
�lˏ_�G�;��l'�����hF���n%n�,O��u���XJ#ϓ�{��1�� e�q<��D�J($c�ф��T��V1,�2��f�v�2�/=kNtRd��u_n��ڠ� ��gC�?_R��C����(���44��`�.��K�P"�Q��5 �	QR��B�	Ll���	�+����\��Q~���S<��|�����\{:^7��E���"3��YD�78R$p~�E�QV��RrEn�aw���}�?�ҖyXh�;��B�3�X�p�0P�tv��p�#��n��,D������t���[,>�E�~����JM:�\?S��u$�&���!G��͖�w��E$Jii�P�$��Aң-LpI,bTq�}�c*�"�	sJ��|v5�U9����WEvoW%?�}�e!���dz*� dJD��价�|ە(�
���Nͱ�\�ʴ��;��E.`�XJC8	!��T��`�tj%]�(ˈ/E��c�V��D�"�v/.mOt�&S*�ᮏN�dx.nu��Ԫ��~���Ѣ�m���f�}C�俄�9�0�:I�!X���0� �*q6�|.�C/Rb��RG;Z?$�6!����Nt��j���;�F����~�j�.e�M�;��C�`����t�Q��ԯ�t��M�h�S�F{cz�`&.�g#��RZ2���\�0�%�q <�X����"���� D
�=w�h�z$.%3:r7;ݞ^t�y���8��ճ����{"�� ����4ʑ0�)�B��X�+�J�s)-�W0&9��0@��\c���`>G^��"{�Q����|8��2�Q��0����5^�wX%x�n�<*z�ڮ�di�P}cD�=$��B�"`B���"���g��s	z�υ�!�$b>� !d/���/ ���n`ª��qW�k����p�,��b�����-��q�����o'�O�_��uL�Nо�����1`���rթur��0��!���RA������D"&�-��G`����V�A���ʔ��Y�z(����mr���m|�.���L|����({�=D�a�Z:�oI}��)$f��$[	C��jL�߁Q����J�s)M��~��<��h�k��^@��>�,1��>�bor�rъѣ��G�r�ܠ����q%�a�/�y����z��q���׸h��IL=�Q��
���^NT"��9���4RȇyA;����!lBKγ)%	�e�xe��T��`��hx>��R>�dU�g
�Y,N��Opw>�T�I����/*�w�D��l���j���z�?�W�E܁�B����PJprkÑ;
\�����Y)r�r1��/�"�a���,x=Ձ�ٽ33W����UC�z��ZG\
��@c��ʴJd��xxj���F&S��K�6�[Vt���6�!/��
H��ظE����zVJ+CEm�,�W1��$0>��Ol�7{�rCE^�},�u~\��l6.��m�z�f�>�B�h�'�ܤA�ٸӁ����Yo�A�	�h)�q~���̭'���Wp�Kib���#!h�' ���� +�}��_�S��b�@��g
-���4\���rv�,庈D��m���0S��ò9�nQ���8���d�;$9�ѰE�@�O�_�P�&��>T�B*L��9�o>�8 ;�q �ڃ�������ݝ3��G���r$̡��OQ3_�gT�����-��\&��d����}���K9����������5�Y���l���#ZF����C` �#ڕo=,`"�B��f��=G��0&��6�%W��Ù��;��>L/�t���[��DC<�@X0�PGi1'F��0�ß]t�B���[�T���lL�9j���vY���X����V{�KQ�3���&p�$ H$IZÿ���\8�W�n�*1��������9�����_�|.�1tA�A��� p8�@^$���mBhĩ��>�D:��}�t��j���*�9���+7���`�x*�h^���������i�3�v������U��,�Bބ]E�oYa�U�SFؿ��ۛ��@vg���8���E��ijô�T�������:��D�6�)݃�������X���s�ev�l�}2����RȲ�)v�c���ƨP؛j��hqQu��޾#����R�����<!�̨��
Nx!$L:2���C���'�����,O���~�\J���������     