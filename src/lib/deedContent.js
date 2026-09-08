export const deedContent = {
  PT_Pendirian: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK YANG MENGADAKAN AKTA INI:

1. {{directorName}}, Warga Negara Indonesia, lahir di {{directorBirthPlace}} pada tanggal {{directorBirthDate}}, pekerjaan {{directorOccupation}}, berkedudukan di {{directorAddress}}, dalam hal ini bertindak selaku Direktur yang mewakili kepentingan Perseroan, setelah akta ini berdiri dan sah berlaku.

MENGADAKAN PERJANJIAN PENDIRIAN PERSEROAN TERBATAS DENGAN SYARAT-SYARAT SEBAGAI BERIKUT:

PASAL 1 - PENDIRIAN
1. Para Pihak dengan ini mendirikan sebuah Perseroan Terbatas yang berbadan hukum Indonesia.
2. Nama Perseroan adalah {{companyName}}, selanjutnya disebut "Perseroan".
3. Perseroan didirikan untuk jangka waktu {{companyDuration}} tahun terhitung sejak tanggal akta ini dibuat, kecuali ditentukan lain berdasarkan keputusan Rapat Umum Pemegang Saham.

PASAL 2 - TEMPAT KEDUDUKAN
1. Perseroan berkedudukan di {{companyAddress}}.
2. Perseroan dapat membuka kantor cabang atau perwakilan di tempat lain di Indonesia maupun di luar negeri berdasarkan keputusan Rapat Umum Pemegang Saham.

PASAL 3 - MAKSUD DAN TUJUAN
Maksud dan tujuan Perseroan adalah: {{businessPurpose}}.

PASAL 4 - MODAL DASAR DAN MODAL DIPERSETUJUI
1. Modal Dasar Perseroan adalah sebesar Rp {{capital}} ({{capitalWords}} Rupiah).
2. Modal Dasar tersebut terbagi dalam {{totalShares}} lembar saham, masing-masing senilai Rp {{shareValue}} ({{shareValueWords}} Rupiah).
3. Modal Diperbolehkan sebesar Rp {{approvedCapital}} ({{approvedCapitalWords}} Rupiah).

PASAL 5 - PEMEGANG SAHAM
Pemegang saham Perseroan adalah:
{{shareholders}}

PASAL 6 - DIREKTUR
1. Perseroan diurus dan diwakili oleh Direktur.
2. Direktur Perseroan adalah: {{directorName}}.

PASAL 7 - KOMISARIS
{{commissioners}}

PASAL 8 - LAMA JABATAN
Direktur dan Komisaris diangkat untuk masa jabatan {{termLength}} tahun terhitung sejak tanggal Rapat Umum Pemegang Saham yang mengangkat mereka.

PASAL 9 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.

Ditandatangani oleh Para Pihak di hadapan Notaris.`,
    fields: [
      { name: 'companyName', label: 'Nama Perusahaan', required: true },
      { name: 'companyAddress', label: 'Alamat Kantor', required: true },
      { name: 'capital', label: 'Modal Dasar', required: true },
      { name: 'capitalWords', label: 'Modal Dasar (terbilang)', required: true },
      { name: 'directorName', label: 'Nama Direktur', required: true },
      { name: 'directorBirthPlace', label: 'Tempat Lahir Direktur', required: true },
      { name: 'directorBirthDate', label: 'Tanggal Lahir Direktur', required: true },
      { name: 'directorOccupation', label: 'Pekerjaan Direktur', required: true },
      { name: 'directorAddress', label: 'Alamat Direktur', required: true },
      { name: 'shareholders', label: 'Pemegang Saham', required: true },
      { name: 'commissioners', label: 'Komisaris', required: false },
      { name: 'businessPurpose', label: 'Tujuan Usaha', required: true },
      { name: 'totalShares', label: 'Jumlah Saham', required: true },
      { name: 'shareValue', label: 'Nilai Per Saham', required: true },
      { name: 'shareValueWords', label: 'Nilai Per Saham (terbilang)', required: true },
      { name: 'approvedCapital', label: 'Modal Diperbolehkan', required: true },
      { name: 'approvedCapitalWords', label: 'Modal Diperbolehkan (terbilang)', required: true },
      { name: 'companyDuration', label: 'Lama Waktu Perseroan (tahun)', required: true },
      { name: 'termLength', label: 'Masa Jabatan Direktur/Komisaris (tahun)', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Pengecekan Nama PT',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Pengajuan SK Kemenkumham',
      'Penerbitan SK',
      'Selesai',
    ],
  },

  PT_Perubahan: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK YANG MENGADAKAN AKTA INI:

1. {{directorName}}, Warga Negara Indonesia, berkedudukan di {{companyAddress}}, dalam hal ini bertindak selaku Direktur {{companyName}} yang sah secara hukum.

MENGADAKAN AKTA PERUBAHAN ANGARAN DASAR PERSEROAN TERBATAS DENGAN SYARAT-SYARAT SEBAGAI BERIKUT:

PASAL 1 - PERUBAHAN
1. Para Pihak dengan ini setuju untuk mengubah ketentuan Anggaran Dasar Perseroan sebagai berikut:
   a. Ketentuan lama: {{oldProvision}}
   b. Ketentuan baru: {{newProvision}}
2. Perubahan ini merupakan bagian tidak terpisahkan dari Anggaran Dasar Perseroan.

PASAL 2 - PENGESAHAN
Perubahan Anggaran Dasar ini mulai berlaku terhitung sejak ditetapkan dengan Keputusan Menteri Hukum dan Hak Asasi Manusia Republik Indonesia.

PASAL 3 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'companyName', label: 'Nama Perusahaan', required: true },
      { name: 'companyAddress', label: 'Alamat Kantor', required: true },
      { name: 'directorName', label: 'Nama Direktur', required: true },
      { name: 'changeType', label: 'Jenis Perubahan', required: true },
      { name: 'oldProvision', label: 'Ketentuan Lama', required: true },
      { name: 'newProvision', label: 'Ketentuan Baru', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Rapat Umum Pemegang Saham',
      'Penyusunan Akta Perubahan',
      'Penandatanganan Akta',
      'Pengajuan ke Kemenkumham',
      'Penerbitan SK Perubahan',
      'Selesai',
    ],
  },

  Yayasan_Pendirian: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK YANG MENDIRIKAN YAYASAN:

1. {{founderName}}, Warga Negara Indonesia, berkedudukan di {{founderAddress}}.

DENGAN INI MENDIRIKAN SEBUAH YAYASAN DENGAN SYARAT-SYARAT SEBAGAI BERIKUT:

PASAL 1 - NAMA DAN BENTUK
1. Yayasan ini adalah badan hukum yang terdiri dari kekayaan yang dipisahkan dan diperuntukkan untuk mencapai tujuan tertentu.
2. Nama Yayasan adalah {{foundationName}}, selanjutnya disebut "Yayasan".

PASAL 2 - TEMPAT KEDUDUKAN
Yayasan berkedudukan di {{foundationAddress}}.

PASAL 3 - TUJUAN
Tujuan Yayasan adalah: {{purpose}}.

PASAL 4 - KEKAYAAN AWAL
Kekayaan awal Yayasan adalah sebesar Rp {{initialAssets}} ({{initialAssetsWords}} Rupiah).

PASAL 5 - YAYASAN DIURUS OLEH
1. Pembina: {{boardMembers}}
2. Pengurus: {{managementBoard}}

PASAL 6 - MASA JABATAN
Pengurus diangkat untuk masa jabatan {{termLength}} tahun.

PASAL 7 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'foundationName', label: 'Nama Yayasan', required: true },
      { name: 'foundationAddress', label: 'Alamat Yayasan', required: true },
      { name: 'founderName', label: 'Nama Pendiri', required: true },
      { name: 'founderAddress', label: 'Alamat Pendiri', required: true },
      { name: 'purpose', label: 'Tujuan Yayasan', required: true },
      { name: 'initialAssets', label: 'Kekayaan Awal', required: true },
      { name: 'initialAssetsWords', label: 'Kekayaan Awal (terbilang)', required: true },
      { name: 'boardMembers', label: 'Anggota Pembina', required: true },
      { name: 'managementBoard', label: 'Anggota Pengurus', required: true },
      { name: 'termLength', label: 'Masa Jabatan (tahun)', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Pengecekan Nama Yayasan',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Pengajuan SK Kemenkumham',
      'Penerbitan SK',
      'Selesai',
    ],
  },

  Yayasan_Perubahan: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK YANG MENGADAKAN AKTA INI:

1. {{boardChairName}}, selaku Ketua Pembina {{foundationName}}.

MENGADAKAN AKTA PERUBAHAN ANGARAN DASAR YAYASAN DENGAN SYARAT-SYARAT SEBAGAI BERIKUT:

PASAL 1 - PERUBAHAN
1. Para Pihak setuju mengubah ketentuan Anggaran Dasar:
   a. Ketentuan lama: {{oldProvision}}
   b. Ketentuan baru: {{newProvision}}
2. Perubahan ini merupakan bagian tidak terpisahkan dari Anggaran Dasar Yayasan.

PASAL 2 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'foundationName', label: 'Nama Yayasan', required: true },
      { name: 'boardChairName', label: 'Nama Ketua Pembina', required: true },
      { name: 'changeType', label: 'Jenis Perubahan', required: true },
      { name: 'oldProvision', label: 'Ketentuan Lama', required: true },
      { name: 'newProvision', label: 'Ketentuan Baru', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Rapat Pembina',
      'Penyusunan Akta Perubahan',
      'Penandatanganan Akta',
      'Pengajuan ke Kemenkumham',
      'Penerbitan SK Perubahan',
      'Selesai',
    ],
  },

  CV_Pendirian: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK YANG MENGADAKAN AKTA INI:

1. {{generalPartner1Name}}, Warga Negara Indonesia, berkedudukan di {{generalPartner1Address}}.
2. {{limitedPartner1Name}}, Warga Negara Indonesia, berkedudukan di {{limitedPartner1Address}}.

MENGADAKAN PERJANJIAN PENDIRIAN PERSEKUTUAN KOMANDITER DENGAN SYARAT-SYARAT SEBAGAI BERIKUT:

PASAL 1 - PENDIRIAN
Para Pihak dengan ini mendirikan Persekutuan Komanditer yang berkedudukan di {{cvAddress}} dengan nama {{cvName}}.

PASAL 2 - MAKSUD DAN TUJUAN
Maksud dan tujuan: {{businessPurpose}}.

PASAL 3 - MODAL
Modal Persekutuan adalah sebesar Rp {{capital}} ({{capitalWords}} Rupiah), terdiri dari:
- Sekutu Pengurus: Rp {{generalPartnerCapital}}
- Sekutu Komanditer: Rp {{limitedPartnerCapital}}

PASAL 4 - SEKUTU PENGGURUS (UMUM)
{{generalPartners}}

PASAL 5 - SEKUTU KOMANDITER
{{limitedPartners}}

PASAL 6 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'cvName', label: 'Nama CV', required: true },
      { name: 'cvAddress', label: 'Alamat CV', required: true },
      { name: 'generalPartner1Name', label: 'Nama Sekutu Pengurus', required: true },
      { name: 'generalPartner1Address', label: 'Alamat Sekutu Pengurus', required: true },
      { name: 'limitedPartner1Name', label: 'Nama Sekutu Komanditer', required: true },
      { name: 'limitedPartner1Address', label: 'Alamat Sekutu Komanditer', required: true },
      { name: 'generalPartners', label: 'Daftar Sekutu Pengurus', required: true },
      { name: 'limitedPartners', label: 'Daftar Sekutu Komanditer', required: true },
      { name: 'capital', label: 'Modal', required: true },
      { name: 'capitalWords', label: 'Modal (terbilang)', required: true },
      { name: 'generalPartnerCapital', label: 'Modal Sekutu Pengurus', required: true },
      { name: 'limitedPartnerCapital', label: 'Modal Sekutu Komanditer', required: true },
      { name: 'businessPurpose', label: 'Tujuan Usaha', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Pendaftaran ke Kemenkumham',
      'Penerbitan SK',
      'Selesai',
    ],
  },

  CV_Perubahan: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK YANG MENGADAKAN AKTA INI:

1. {{generalPartnerName}}, selaku Sekutu Pengurus {{cvName}}.

MENGADAKAN AKTA PERUBAHAN PERSEKUTUAN KOMANDITER:

PASAL 1 - PERUBAHAN
1. Ketentuan lama: {{oldProvision}}
2. Ketentuan baru: {{newProvision}}

PASAL 2 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'cvName', label: 'Nama CV', required: true },
      { name: 'generalPartnerName', label: 'Nama Sekutu Pengurus', required: true },
      { name: 'changeType', label: 'Jenis Perubahan', required: true },
      { name: 'oldProvision', label: 'Ketentuan Lama', required: true },
      { name: 'newProvision', label: 'Ketentuan Baru', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Musyawarah Sekutu',
      'Penyusunan Akta Perubahan',
      'Penandatanganan Akta',
      'Pengajuan ke Kemenkumham',
      'Penerbitan SK Perubahan',
      'Selesai',
    ],
  },

  Koperasi_Pendirian: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK YANG MENDIRIKAN KOPERASI:

1. {{founderName}}, berkedudukan di {{founderAddress}}.

DENGAN INI MENDIRIKAN KOPERASI DENGAN SYARAT-SYARAT SEBAGAI BERIKUT:

PASAL 1 - NAMA DAN TEMPAT KEDUDUKAN
1. Koperasi bernama {{coopName}}.
2. Berkedudukan di {{coopAddress}}.

PASAL 2 - TUJUAN
{{purpose}}.

PASAL 3 - MODAL AWAL
Modal awal sebesar Rp {{capital}} ({{capitalWords}} Rupiah).

PASAL 4 - ANGGOTA
Pendiri koperasi adalah: {{founders}}.

PASAL 5 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'coopName', label: 'Nama Koperasi', required: true },
      { name: 'coopAddress', label: 'Alamat Koperasi', required: true },
      { name: 'founderName', label: 'Nama Pendiri', required: true },
      { name: 'founderAddress', label: 'Alamat Pendiri', required: true },
      { name: 'founders', label: 'Daftar Pendiri', required: true },
      { name: 'capital', label: 'Modal Awal', required: true },
      { name: 'capitalWords', label: 'Modal Awal (terbilang)', required: true },
      { name: 'purpose', label: 'Tujuan Koperasi', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Rapat Pendirian',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Pengajuan ke Dinas Koperasi',
      'Penerbitan SK',
      'Selesai',
    ],
  },

  Koperasi_Perubahan: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK:

1. {{chairmanName}}, selaku Ketua Pengurus {{coopName}}.

MENGADAKAN AKTA PERUBAHAN ANGARAN DASAR KOPERASI:

PASAL 1 - PERUBAHAN
1. Ketentuan lama: {{oldProvision}}
2. Ketentuan baru: {{newProvision}}

PASAL 2 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'coopName', label: 'Nama Koperasi', required: true },
      { name: 'chairmanName', label: 'Nama Ketua Pengurus', required: true },
      { name: 'changeType', label: 'Jenis Perubahan', required: true },
      { name: 'oldProvision', label: 'Ketentuan Lama', required: true },
      { name: 'newProvision', label: 'Ketentuan Baru', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Rapat Anggota',
      'Penyusunan Akta Perubahan',
      'Penandatanganan Akta',
      'Pengajuan ke Dinas Koperasi',
      'Penerbitan SK Perubahan',
      'Selesai',
    ],
  },

  Jual_Beli_Tanah: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK YANG MENGADAKAN AKTA INI:

1. {{sellerName}}, Warga Negara Indonesia, berkedudukan di {{sellerAddress}}, dalam hal ini bertindak sebagai PENJUAL.
2. {{buyerName}}, Warga Negara Indonesia, berkedudukan di {{buyerAddress}}, dalam hal ini bertindak sebagai PEMBELI.

PARA PIHAK DENGAN INI MENGADAKAN JUAL BELI TANAH DENGAN SYARAT-SYARAT SEBAGAI BERIKUT:

PASAL 1 - OBJEK JUAL BELI
1. Tanah yang dijual belikan adalah sebidang tanah seluas {{landArea}} m² yang terletak di {{landLocation}}.
2. Sertifikat Nomor {{landCertificate}} atas nama {{certificateHolder}}.
3. Tanah tersebut terbebas dari sengketa, hipotek, dan jaminan lainnya.

PASAL 2 - HARGA JUAL BELI
1. Harga jual beli tanah tersebut adalah sebesar Rp {{price}} ({{priceWords}} Rupiah).
2. Pembayaran dilakukan dengan cara: {{paymentMethod}}.

PASAL 3 - PELEPASAN HAK
Dengan ditandatanganinya akta ini, Penjual dengan ini melepaskan hak milik atas tanah tersebut kepada Pembeli dan Pembeli menerima penyerahan hak milik atas tanah tersebut.

PASAL 4 - PEMBAYARAN PAJAK
1. Pajak BPHTB (Bea Perolehan Hak atas Tanah dan Bangunan) dibebankan kepada {{bphtbBurden}}.
2. PPh (Pajak Penghasilan) dibebankan kepada {{pphBurden}}.

PASAL 5 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'sellerName', label: 'Nama Penjual', required: true },
      { name: 'sellerNik', label: 'NIK Penjual', required: true },
      { name: 'sellerBirthPlace', label: 'Tempat Lahir Penjual', required: true },
      { name: 'sellerBirthDate', label: 'Tanggal Lahir Penjual', required: true },
      { name: 'sellerOccupation', label: 'Pekerjaan Penjual', required: true },
      { name: 'sellerMaritalStatus', label: 'Status Perkawinan Penjual', required: true },
      { name: 'sellerSpouseName', label: 'Nama Pasangan Penjual', required: false },
      { name: 'sellerAddress', label: 'Alamat Penjual', required: true },
      { name: 'buyerName', label: 'Nama Pembeli', required: true },
      { name: 'buyerNik', label: 'NIK Pembeli', required: true },
      { name: 'buyerBirthPlace', label: 'Tempat Lahir Pembeli', required: true },
      { name: 'buyerBirthDate', label: 'Tanggal Lahir Pembeli', required: true },
      { name: 'buyerOccupation', label: 'Pekerjaan Pembeli', required: true },
      { name: 'buyerMaritalStatus', label: 'Status Perkawinan Pembeli', required: true },
      { name: 'buyerSpouseName', label: 'Nama Pasangan Pembeli', required: false },
      { name: 'buyerAddress', label: 'Alamat Pembeli', required: true },
      { name: 'landRightType', label: 'Jenis Hak Tanah', required: true },
      { name: 'landLocation', label: 'Lokasi Tanah', required: true },
      { name: 'landArea', label: 'Luas Tanah (m²)', required: true },
      { name: 'landNIB', label: 'NIB Tanah', required: true },
      { name: 'landCertificate', label: 'Nomor Sertifikat', required: true },
      { name: 'certificateHolder', label: 'Nama Pemegang Sertifikat', required: true },
      { name: 'landSurveyNumber', label: 'Nomor Surat Ukur', required: true },
      { name: 'landSurveyDate', label: 'Tanggal Surat Ukur', required: true },
      { name: 'landNOP', label: 'NOP PBB', required: true },
      { name: 'landBoundariesNorth', label: 'Batas Utara', required: true },
      { name: 'landBoundariesSouth', label: 'Batas Selatan', required: true },
      { name: 'landBoundariesEast', label: 'Batas Timur', required: true },
      { name: 'landBoundariesWest', label: 'Batas Barat', required: true },
      { name: 'price', label: 'Harga Jual Beli', required: true },
      { name: 'priceWords', label: 'Harga (terbilang)', required: true },
      { name: 'paymentMethod', label: 'Cara Pembayaran', required: true },
      { name: 'bphtbBurden', label: 'Beban BPHTB', required: true },
      { name: 'pphBurden', label: 'Beban PPh', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },

    ],
    stages: [
      'Verifikasi Dokumen Tanah',
      'Cek Sertifikat di BPN',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Pembayaran BPHTB',
      'Pendaftaran ke BPN',
      'Selesai',
    ],
  },

  Jual_Beli_Properti: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK:

1. {{sellerName}}, Warga Negara Indonesia, berkedudukan di {{sellerAddress}}, sebagai PENJUAL.
2. {{buyerName}}, Warga Negara Indonesia, berkedudukan di {{buyerAddress}}, sebagai PEMBELI.

PASAL 1 - OBJEK JUAL BELI
Properti yang dijual belikan adalah:
1. Lokasi: {{propertyLocation}}
2. Jenis Properti: {{propertyType}}
3. Luas Bangunan: {{buildingArea}} m²
4. Luas Tanah: {{landArea}} m²
5. Sertifikat Nomor: {{certificateNumber}}
6. Bebas dari sengketa dan hipotek.

PASAL 2 - HARGA JUAL BELI
Harga jual beli adalah sebesar Rp {{price}} ({{priceWords}} Rupiah), dibayar dengan {{paymentMethod}}.

PASAL 3 - PELEPASAN HAK
Penjual melepaskan hak milik kepada Pembeli setelah pembayaran lunas.

PASAL 4 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'sellerName', label: 'Nama Penjual', required: true },
      { name: 'sellerNik', label: 'NIK Penjual', required: true },
      { name: 'sellerBirthPlace', label: 'Tempat Lahir Penjual', required: true },
      { name: 'sellerBirthDate', label: 'Tanggal Lahir Penjual', required: true },
      { name: 'sellerOccupation', label: 'Pekerjaan Penjual', required: true },
      { name: 'sellerMaritalStatus', label: 'Status Perkawinan Penjual', required: true },
      { name: 'sellerSpouseName', label: 'Nama Pasangan Penjual', required: false },
      { name: 'sellerAddress', label: 'Alamat Penjual', required: true },
      { name: 'buyerName', label: 'Nama Pembeli', required: true },
      { name: 'buyerNik', label: 'NIK Pembeli', required: true },
      { name: 'buyerBirthPlace', label: 'Tempat Lahir Pembeli', required: true },
      { name: 'buyerBirthDate', label: 'Tanggal Lahir Pembeli', required: true },
      { name: 'buyerOccupation', label: 'Pekerjaan Pembeli', required: true },
      { name: 'buyerMaritalStatus', label: 'Status Perkawinan Pembeli', required: true },
      { name: 'buyerSpouseName', label: 'Nama Pasangan Pembeli', required: false },
      { name: 'buyerAddress', label: 'Alamat Pembeli', required: true },
      { name: 'propertyLocation', label: 'Lokasi Properti', required: true },
      { name: 'propertyType', label: 'Jenis Properti', required: true },
      { name: 'buildingArea', label: 'Luas Bangunan (m²)', required: true },
      { name: 'landArea', label: 'Luas Tanah (m²)', required: true },
      { name: 'landRightType', label: 'Jenis Hak Tanah', required: true },
      { name: 'landNIB', label: 'NIB', required: true },
      { name: 'landSurveyNumber', label: 'Nomor Surat Ukur', required: true },
      { name: 'landSurveyDate', label: 'Tanggal Surat Ukur', required: true },
      { name: 'landNOP', label: 'NOP PBB', required: true },
      { name: 'landBoundariesNorth', label: 'Batas Utara', required: true },
      { name: 'landBoundariesSouth', label: 'Batas Selatan', required: true },
      { name: 'landBoundariesEast', label: 'Batas Timur', required: true },
      { name: 'landBoundariesWest', label: 'Batas Barat', required: true },
      { name: 'certificateNumber', label: 'Nomor Sertifikat', required: true },
      { name: 'price', label: 'Harga Jual Beli', required: true },
      { name: 'priceWords', label: 'Harga (terbilang)', required: true },
      { name: 'paymentMethod', label: 'Cara Pembayaran', required: true },
      { name: 'bphtbBurden', label: 'Beban BPHTB', required: true },
      { name: 'pphBurden', label: 'Beban PPh', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },

    ],
    stages: [
      'Verifikasi Dokumen Properti',
      'Cek Sertifikat di BPN',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Pembayaran BPHTB',
      'Pendaftaran ke BPN',
      'Selesai',
    ],
  },

  Jual_Beli_Kendaraan: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK:

1. {{sellerName}}, Warga Negara Indonesia, berkedudukan di {{sellerAddress}}, sebagai PENJUAL.
2. {{buyerName}}, Warga Negara Indonesia, berkedudukan di {{buyerAddress}}, sebagai PEMBELI.

PASAL 1 - OBJEK JUAL BELI
Kendaraan yang dijual belikan adalah:
1. Jenis Kendaraan: {{vehicleType}}
2. Merk/Type: {{vehicleBrand}} {{vehicleModel}}
3. Tahun Pembuatan: {{vehicleYear}}
4. Nomor Polisi: {{vehicleNumber}}
5. Nomor Rangka: {{chassisNumber}}
6. Nomor Mesin: {{engineNumber}}
7. Warna: {{vehicleColor}}
8. Bahan Bakar: {{fuelType}}

PASAL 2 - HARGA JUAL BELI
Harga jual beli kendaraan adalah sebesar Rp {{price}} ({{priceWords}} Rupiah).

PASAL 3 - PELEPASAN HAK
Penjual menyerahkan BPKB kendaraan kepada Pembeli beserta surat-surat lainnya. Pembeli bertanggung jawab untuk proses balik nama.

PASAL 4 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'sellerName', label: 'Nama Penjual', required: true },
      { name: 'sellerNik', label: 'NIK Penjual', required: true },
      { name: 'sellerBirthPlace', label: 'Tempat Lahir Penjual', required: true },
      { name: 'sellerBirthDate', label: 'Tanggal Lahir Penjual', required: true },
      { name: 'sellerOccupation', label: 'Pekerjaan Penjual', required: true },
      { name: 'sellerMaritalStatus', label: 'Status Perkawinan Penjual', required: true },
      { name: 'sellerSpouseName', label: 'Nama Pasangan Penjual', required: false },
      { name: 'sellerAddress', label: 'Alamat Penjual', required: true },
      { name: 'buyerName', label: 'Nama Pembeli', required: true },
      { name: 'buyerNik', label: 'NIK Pembeli', required: true },
      { name: 'buyerBirthPlace', label: 'Tempat Lahir Pembeli', required: true },
      { name: 'buyerBirthDate', label: 'Tanggal Lahir Pembeli', required: true },
      { name: 'buyerOccupation', label: 'Pekerjaan Pembeli', required: true },
      { name: 'buyerMaritalStatus', label: 'Status Perkawinan Pembeli', required: true },
      { name: 'buyerSpouseName', label: 'Nama Pasangan Pembeli', required: false },
      { name: 'buyerAddress', label: 'Alamat Pembeli', required: true },
      { name: 'vehicleType', label: 'Jenis Kendaraan', required: true },
      { name: 'vehicleBrand', label: 'Merk Kendaraan', required: true },
      { name: 'vehicleModel', label: 'Type/Model', required: true },
      { name: 'vehicleYear', label: 'Tahun Pembuatan', required: true },
      { name: 'vehicleNumber', label: 'Nomor Polisi', required: true },
      { name: 'chassisNumber', label: 'Nomor Rangka', required: true },
      { name: 'engineNumber', label: 'Nomor Mesin', required: true },
      { name: 'vehicleColor', label: 'Warna Kendaraan', required: true },
      { name: 'fuelType', label: 'Jenis Bahan Bakar', required: true },
      { name: 'price', label: 'Harga Jual Beli', required: true },
      { name: 'priceWords', label: 'Harga (terbilang)', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },

    ],
    stages: [
      'Verifikasi Dokumen Kendaraan',
      'Cek BPKB',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Balik Nama di Samsat',
      'Selesai',
    ],
  },

  Perjanjian_Kredit: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK:

1. {{creditorName}}, Warga Negara Indonesia, berkedudukan di {{creditorAddress}}, dalam hal ini bertindak sebagai PEMBERI KREDIT.
2. {{debtorName}}, Warga Negara Indonesia, berkedudukan di {{debtorAddress}}, dalam hal ini bertindak sebagai PENERIMA KREDIT.

PARA PIHAK DENGAN INI MENGADAKAN PERJANJIAN KREDIT DENGAN SYARAT-SYARAT SEBAGAI BERIKUT:

PASAL 1 - PEMBERIAN KREDIT
1. Pemberi Kredit setuju memberikan kredit kepada Penerima Kredit sebesar Rp {{loanAmount}} ({{loanAmountWords}} Rupiah).
2. Kredit diberikan dalam bentuk {{loanType}}.

PASAL 2 - BUNGA
Kredit dikenakan suku bunga sebesar {{interestRate}} per bulan.

PASAL 3 - JANGKA WAKTU
Kredit harus dilunasi selambat-lambatnya pada {{repaymentDeadline}}.

PASAL 4 - JADWAL PEMBAYARAN
{{repaymentSchedule}}

PASAL 5 - JAMINAN
{{collateral}}

PASAL 6 - SANKSI KETERLAMBATAN
Apabila Penerima Kredit terlambat membayar, dikenakan denda keterlambatan sebesar {{lateFee}} per hari keterlambatan.

PASAL 7 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'creditorName', label: 'Nama Pemberi Kredit', required: true },
      { name: 'creditorNik', label: 'NIK Pemberi Kredit', required: true },
      { name: 'creditorBirthPlace', label: 'Tempat Lahir Pemberi Kredit', required: true },
      { name: 'creditorBirthDate', label: 'Tanggal Lahir Pemberi Kredit', required: true },
      { name: 'creditorOccupation', label: 'Pekerjaan Pemberi Kredit', required: true },
      { name: 'creditorAddress', label: 'Alamat Pemberi Kredit', required: true },
      { name: 'debtorName', label: 'Nama Penerima Kredit', required: true },
      { name: 'debtorNik', label: 'NIK Penerima Kredit', required: true },
      { name: 'debtorBirthPlace', label: 'Tempat Lahir Penerima Kredit', required: true },
      { name: 'debtorBirthDate', label: 'Tanggal Lahir Penerima Kredit', required: true },
      { name: 'debtorOccupation', label: 'Pekerjaan Penerima Kredit', required: true },
      { name: 'debtorAddress', label: 'Alamat Penerima Kredit', required: true },
      { name: 'loanAmount', label: 'Jumlah Pinjaman', required: true },
      { name: 'loanAmountWords', label: 'Jumlah Pinjaman (terbilang)', required: true },
      { name: 'loanType', label: 'Jenis Kredit', required: true },
      { name: 'interestRate', label: 'Suku Bunga', required: true },
      { name: 'loanTerm', label: 'Jangka Waktu', required: true },
      { name: 'repaymentDeadline', label: 'Tanggal Jatuh Tempo', required: true },
      { name: 'repaymentSchedule', label: 'Jadwal Pembayaran', required: true },
      { name: 'collateral', label: 'Jaminan', required: false },
      { name: 'lateFee', label: 'Denda Keterlambatan', required: false },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Negosiasi Syarat Kredit',
      'Penyusunan Perjanjian',
      'Review Hukum',
      'Penandatanganan Perjanjian',
      'Pencairan Kredit',
      'Selesai',
    ],
  },

  Perjanjian_Sewa: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK:

1. {{lessorName}}, Warga Negara Indonesia, berkedudukan di {{lessorAddress}}, dalam hal ini bertindak sebagai PIHAK YANG MENYEWAKAN.
2. {{lesseeName}}, Warga Negara Indonesia, berkedudukan di {{lesseeAddress}}, dalam hal ini bertindak sebagai PIHAK PENYEWA.

PARA PIHAK MENGADAKAN PERJANJIAN SEWA-MENYEWAKAN:

PASAL 1 - OBJEK SEWA
Objek yang disewakan adalah: {{objectLeased}}.

PASAL 2 - JANGKA WAKTU
Jangka waktu sewa: {{leasePeriod}}, terhitung mulai {{leaseStart}} sampai dengan {{leaseEnd}}.

PASAL 3 - UANG SEWA
1. Uang sewa sebesar Rp {{rentAmount}} ({{rentAmountWords}} Rupiah) dibayarkan {{paymentSchedule}}.
2. Pembayaran dilakukan melalui {{paymentMethod}}.

PASAL 4 - UANG JAMINAN
{{deposit}}

PASAL 5 - KEWAJIBAN PIHAK PENYEWA
{{lesseeObligations}}

PASAL 6 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'lessorName', label: 'Nama Pihak Menyewakan', required: true },
      { name: 'lessorAddress', label: 'Alamat Pihak Menyewakan', required: true },
      { name: 'lesseeName', label: 'Nama Pihak Penyewa', required: true },
      { name: 'lesseeNik', label: 'NIK Pihak Penyewa', required: true },
      { name: 'lesseeBirthPlace', label: 'Tempat Lahir Pihak Penyewa', required: true },
      { name: 'lesseeBirthDate', label: 'Tanggal Lahir Pihak Penyewa', required: true },
      { name: 'lesseeAddress', label: 'Alamat Pihak Penyewa', required: true },
      { name: 'objectLeased', label: 'Objek yang Disewakan', required: true },
      { name: 'leasePeriod', label: 'Jangka Waktu Sewa', required: true },
      { name: 'leaseStart', label: 'Tanggal Mulai', required: true },
      { name: 'leaseEnd', label: 'Tanggal Berakhir', required: true },
      { name: 'rentAmount', label: 'Jumlah Sewa', required: true },
      { name: 'rentAmountWords', label: 'Jumlah Sewa (terbilang)', required: true },
      { name: 'paymentSchedule', label: 'Jadwal Pembayaran', required: true },
      { name: 'paymentMethod', label: 'Cara Pembayaran', required: true },
      { name: 'deposit', label: 'Uang Jaminan', required: false },
      { name: 'lesseeObligations', label: 'Kewajiban Penyewa', required: false },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Negosiasi Syarat Sewa',
      'Penyusunan Perjanjian',
      'Review Hukum',
      'Penandatanganan Perjanjian',
      'Serah Terima Objek',
      'Selesai',
    ],
  },

  Perjanjian_Kerjasama: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK:

1. {{partyAName}}, Warga Negara Indonesia, berkedudukan di {{partyAAddress}}, dalam hal ini bertindak sebagai PIHAK PERTAMA.
2. {{partyBName}}, Warga Negara Indonesia, berkedudukan di {{partyBAddress}}, dalam hal ini bertindak sebagai PIHAK KEDUA.

PARA PIHAK MENGADAKAN PERJANJIAN KERJA SAMA BISNIS:

PASAL 1 - JENIS KERJA SAMA
Para Pihak setuju untuk melakukan kerja sama dalam bidang: {{cooperationType}}.

PASAL 2 - RUANG LINGKUP
{{cooperationScope}}

PASAL 3 - JANGKA WAKTU
Kerja sama berlaku untuk jangka waktu: {{duration}}.

PASAL 4 - PEMBAGIAN KEUNTUNGAN
{{profitSharing}}

PASAL 5 - KEWAJIBAN PARA PIHAK
{{responsibilities}}

PASAL 6 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'partyAName', label: 'Nama Pihak Pertama', required: true },
      { name: 'partyANik', label: 'NIK Pihak Pertama', required: true },
      { name: 'partyABirthPlace', label: 'Tempat Lahir Pihak Pertama', required: true },
      { name: 'partyABirthDate', label: 'Tanggal Lahir Pihak Pertama', required: true },
      { name: 'partyAAddress', label: 'Alamat Pihak Pertama', required: true },
      { name: 'partyBName', label: 'Nama Pihak Kedua', required: true },
      { name: 'partyBNik', label: 'NIK Pihak Kedua', required: true },
      { name: 'partyBBirthPlace', label: 'Tempat Lahir Pihak Kedua', required: true },
      { name: 'partyBBirthDate', label: 'Tanggal Lahir Pihak Kedua', required: true },
      { name: 'partyBAddress', label: 'Alamat Pihak Kedua', required: true },
      { name: 'cooperationType', label: 'Jenis Kerja Sama', required: true },
      { name: 'cooperationScope', label: 'Ruang Lingkup', required: true },
      { name: 'profitSharing', label: 'Pembagian Keuntungan', required: true },
      { name: 'duration', label: 'Jangka Waktu', required: true },
      { name: 'responsibilities', label: 'Kewajiban Masing-masing Pihak', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Negosiasi Kerja Sama',
      'Penyusunan Perjanjian',
      'Review Hukum',
      'Penandatanganan Perjanjian',
      'Implementasi Kerja Sama',
      'Selesai',
    ],
  },

  Perjanjian_Pengakuan_Utang: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK:

1. {{creditorName}}, Warga Negara Indonesia, berkedudukan di {{creditorAddress}}, sebagai KREDITOR.
2. {{debtorName}}, Warga Negara Indonesia, berkedudukan di {{debtorAddress}}, sebagai DEBITOR.

PASAL 1 - PENGAKUAN UTANG
1. Debitor dengan ini mengakui mempunyai utang kepada Kreditor sebesar Rp {{debtAmount}} ({{debtAmountWords}} Rupiah.
2. Asal utang: {{debtOrigin}}.

PASAL 2 - JATUH TEMPO
Utang harus dilunasi selambat-lambatnya pada {{repaymentDate}}.

PASAL 3 - JAMINAN
{{collateral}}

PASAL 4 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'creditorName', label: 'Nama Kreditor', required: true },
      { name: 'creditorNik', label: 'NIK Kreditor', required: true },
      { name: 'creditorBirthPlace', label: 'Tempat Lahir Kreditor', required: true },
      { name: 'creditorBirthDate', label: 'Tanggal Lahir Kreditor', required: true },
      { name: 'creditorAddress', label: 'Alamat Kreditor', required: true },
      { name: 'debtorName', label: 'Nama Debitor', required: true },
      { name: 'debtorNik', label: 'NIK Debitor', required: true },
      { name: 'debtorBirthPlace', label: 'Tempat Lahir Debitor', required: true },
      { name: 'debtorBirthDate', label: 'Tanggal Lahir Debitor', required: true },
      { name: 'debtorAddress', label: 'Alamat Debitor', required: true },
      { name: 'debtAmount', label: 'Jumlah Utang', required: true },
      { name: 'debtAmountWords', label: 'Jumlah Utang (terbilang)', required: true },
      { name: 'debtOrigin', label: 'Asal Usul Utang', required: true },
      { name: 'repaymentDate', label: 'Tanggal Jatuh Tempo', required: true },
      { name: 'collateral', label: 'Jaminan', required: false },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Verifikasi Utang',
      'Penyusunan Perjanjian',
      'Review Hukum',
      'Penandatanganan Perjanjian',
      'Selesai',
    ],
  },

  Akta_Hak_Waris: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK:

1. {{heir1Name}}, Warga Negara Indonesia, berkedudukan di {{heir1Address}}, sebagai Ahli Waris.

BERTINDAK ATAS NAMA PARA AHLI WARIS ALMARHUM/ALMARHUMAH {{deceasedName}}.

PASAL 1 - KEMATIAN
{{deceasedName}} telah meninggal dunia pada tanggal {{deceasedDate}} di {{deceasedPlace}}.

PASAL 2 - AHLI WARIS
Yang berhak menjadi ahli waris berdasarkan hukum yang berlaku adalah:
{{heirs}}

PASAL 3 - HARTA WARISAN
Harta peninggalan almarhum/almarhumah terdiri dari:
{{inheritedAssets}}

PASAL 4 - PEMBAGIAN WARISAN
Para ahli waris dengan ini setuju untuk membagi harta warisan sebagai berikut:
{{distribution}}

PASAL 5 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'deceasedName', label: 'Nama Almarhum/Almarhumah', required: true },
      { name: 'deceasedNik', label: 'NIK Almarhum', required: true },
      { name: 'deceasedDate', label: 'Tanggal Meninggal', required: true },
      { name: 'deceasedPlace', label: 'Tempat Meninggal', required: true },
      { name: 'heir1Name', label: 'Nama Ahli Waris (Utama)', required: true },
      { name: 'heir1Address', label: 'Alamat Ahli Waris', required: true },
      { name: 'heirs', label: 'Daftar Ahli Waris', required: true },
      { name: 'inheritedAssets', label: 'Harta Warisan', required: true },
      { name: 'distribution', label: 'Pembagian Warisan', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Verifikasi Dokumen Kematian',
      'Pendataan Ahli Waris',
      'Inventarisasi Harta Warisan',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Selesai',
    ],
  },

  Akta_Wasiat: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PEWASIAT:

{{testatorName}}, Warga Negara Indonesia, lahir di {{testatorBirthPlace}} pada tanggal {{testatorBirthDate}}, pekerjaan {{testatorOccupation}}, berkedudukan di {{testatorAddress}}.

DENGAN INI MENYATAKAN KEHENDAK-NYA UNTUK MENGADAKAN WASIAT DENGAN SYARAT-SYARAT SEBAGAI BERIKUT:

PASAL 1 - PERNYATAAN KEHENDAK
Pewasiat dengan ini menyatakan kehendaknya untuk memberikan wasiat atas harta kekayaannya setelah ia meninggal dunia.

PASAL 2 - PENERIMA WASIAT
Pewasiat memberikan wasiat kepada:
{{beneficiaries}}

PASAL 3 - HARTA YANG DIWASIATKAN
{{bequeathedAssets}}

PASAL 4 - SYARAT-SYARAT
{{conditions}}

PASAL 5 - PELAKSANA WASIAT
Pelaksana wasiat yang ditunjuk adalah: {{executor}}.

PASAL 6 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'testatorName', label: 'Nama Pewasiat', required: true },
      { name: 'testatorNik', label: 'NIK Pewasiat', required: true },
      { name: 'testatorBirthPlace', label: 'Tempat Lahir Pewasiat', required: true },
      { name: 'testatorBirthDate', label: 'Tanggal Lahir Pewasiat', required: true },
      { name: 'testatorOccupation', label: 'Pekerjaan Pewasiat', required: true },
      { name: 'testatorAddress', label: 'Alamat Pewasiat', required: true },
      { name: 'beneficiaries', label: 'Penerima Wasiat', required: true },
      { name: 'bequeathedAssets', label: 'Harta yang Diwasiatkan', required: true },
      { name: 'conditions', label: 'Syarat-syarat Wasiat', required: false },
      { name: 'executor', label: 'Pelaksana Wasiat', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Konsultasi dengan Pewasiat',
      'Penyusunan Akta Wasiat',
      'Penandatanganan Akta',
      'Pendaftaran di Pusat Daftar Wasiat',
      'Selesai',
    ],
  },

  Akta_Hibah: {
    preamble: `DEMI TUHAN YANG MAHA ESA, KAMI YANG NAMA-NAMA TERTULIS DI BAWAH INI:`,
    body: `PARA PIHAK:

1. {{donorName}}, Warga Negara Indonesia, berkedudukan di {{donorAddress}}, sebagai PEMBERI HIBAH.
2. {{doneeName}}, Warga Negara Indonesia, berkedudukan di {{doneeAddress}}, sebagai PENERIMA HIBAH.

PARA PIHAK DENGAN INI MENGADAKAN AKTA HIBAH:

PASAL 1 - PEMBERIAN HIBAH
1. Pemberi Hibah dengan ini dengan sukarela memberikan hibah kepada Penerima Hibah.
2. Penerima Hibah dengan ini menerima hibah tersebut.

PASAL 2 - OBJEK HIBAH
Harta yang dihibahkan adalah: {{giftedAssets}}.

PASAL 3 - NILAI HIBAH
Nilai harta yang dihibahkan adalah sebesar Rp {{assetValue}} ({{assetValueWords}} Rupiah).

PASAL 4 - SYARAT-SYARAT
{{conditions}}

PASAL 5 - PEMBAYARAN PAJAK
Pajak Bea Perolehan Hak atas Tanah dan Bangunan (BPHTB) atau pajak lainnya terkait hibah ini dibebankan kepada {{taxBurden}}.

PASAL 6 - PENUTUP
Akta ini dibuat pada tanggal {{signingDate}} di {{signingCity}}.`,
    fields: [
      { name: 'donorName', label: 'Nama Pemberi Hibah', required: true },
      { name: 'donorNik', label: 'NIK Pemberi Hibah', required: true },
      { name: 'donorBirthPlace', label: 'Tempat Lahir Pemberi Hibah', required: true },
      { name: 'donorBirthDate', label: 'Tanggal Lahir Pemberi Hibah', required: true },
      { name: 'donorOccupation', label: 'Pekerjaan Pemberi Hibah', required: true },
      { name: 'donorAddress', label: 'Alamat Pemberi Hibah', required: true },
      { name: 'doneeName', label: 'Nama Penerima Hibah', required: true },
      { name: 'doneeNik', label: 'NIK Penerima Hibah', required: true },
      { name: 'doneeBirthPlace', label: 'Tempat Lahir Penerima Hibah', required: true },
      { name: 'doneeBirthDate', label: 'Tanggal Lahir Penerima Hibah', required: true },
      { name: 'doneeOccupation', label: 'Pekerjaan Penerima Hibah', required: true },
      { name: 'doneeAddress', label: 'Alamat Penerima Hibah', required: true },
      { name: 'giftedAssets', label: 'Harta yang Dihibahkan', required: true },
      { name: 'assetValue', label: 'Nilai Harta', required: true },
      { name: 'assetValueWords', label: 'Nilai Harta (terbilang)', required: true },
      { name: 'conditions', label: 'Syarat-syarat Hibah', required: false },
      { name: 'taxBurden', label: 'Beban Pajak', required: true },
      { name: 'ppatName', label: 'Nama PPAT', required: true },
      { name: 'ppatAddress', label: 'Alamat PPAT', required: true },
      { name: 'ppatWorkArea', label: 'Wilayah Kerja PPAT', required: true },
      { name: 'ppatSkNumber', label: 'No SK PPAT', required: true },
      { name: 'ppatSkDate', label: 'Tanggal SK PPAT', required: true },
      { name: 'aktaNumber', label: 'Nomor Akta', required: true },
      { name: 'witness1Name', label: 'Nama Saksi 1', required: true },
      { name: 'witness1Address', label: 'Alamat Saksi 1', required: true },
      { name: 'witness2Name', label: 'Nama Saksi 2', required: true },
      { name: 'witness2Address', label: 'Alamat Saksi 2', required: true },
      { name: 'signingDate', label: 'Tanggal Penandatanganan', required: true },
      { name: 'signingCity', label: 'Kota Penandatanganan', required: true },
    ],
    stages: [
      'Verifikasi Dokumen',
      'Penyusunan Akta Hibah',
      'Penandatanganan Akta',
      'Pembayaran Bea Perolehan',
      'Peralihan Hak',
      'Selesai',
    ],
  },
};

export function getDeedContent(aktaType) {
  return deedContent[aktaType] || null;
}
