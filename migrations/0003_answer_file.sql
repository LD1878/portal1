-- File name of the scan attached to a packet item. The bytes are not stored.
alter table case_answers add column if not exists file_name text;
