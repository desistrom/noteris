import 'dotenv/config';
import { db as defaultDb } from '../lib/db.js';
import { aktaTemplates, templateFields, users } from '../lib/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from '../lib/password.js';

const templatesToSeed = [
  {
    aktaType: 'PT_Pendirian',
    category: 'Pendirian Perusahaan',
    name: 'Akta Pendirian Perseroan Terbatas',
    description: 'Akta pendirian PT sesuai UU PT No. 40 Tahun 2007',
  },
  {
    aktaType: 'PT_Perubahan',
    category: 'Pendirian Perusahaan',
    name: 'Akta Perubahan Anggaran Dasar PT',
    description: 'Akta perubahan AD/ART PT',
  },
  {
    aktaType: 'Yayasan_Pendirian',
    category: 'Pendirian Perusahaan',
    name: 'Akta Pendirian Yayasan',
    description: 'Akta pendirian yayasan sesuai UU No. 16 Tahun 2001',
  },
  {
    aktaType: 'Yayasan_Perubahan',
    category: 'Pendirian Perusahaan',
    name: 'Akta Perubahan Anggaran Dasar Yayasan',
    description: 'Akta perubahan AD/ART yayasan',
  },
  {
    aktaType: 'CV_Pendirian',
    category: 'Pendirian Perusahaan',
    name: 'Akta Pendirian CV',
    description: 'Akta pendirian Persekutuan Komanditer',
  },
  {
    aktaType: 'CV_Perubahan',
    category: 'Pendirian Perusahaan',
    name: 'Akta Perubahan CV',
    description: 'Akta perubahan Persekutuan Komanditer',
  },
  {
    aktaType: 'Koperasi_Pendirian',
    category: 'Pendirian Perusahaan',
    name: 'Akta Pendirian Koperasi',
    description: 'Akta pendirian koperasi',
  },
  {
    aktaType: 'Koperasi_Perubahan',
    category: 'Pendirian Perusahaan',
    name: 'Akta Perubahan Koperasi',
    description: 'Akta perubahan anggaran dasar koperasi',
  },
  {
    aktaType: 'Jual_Beli_Tanah',
    category: 'Transaksi Aset',
    name: 'Akta Jual Beli Tanah',
    description: 'Akta jual beli hak milik tanah',
  },
  {
    aktaType: 'Jual_Beli_Properti',
    category: 'Transaksi Aset',
    name: 'Akta Jual Beli Properti',
    description: 'Akta jual beli properti (tanah dan bangunan)',
  },
  {
    aktaType: 'Jual_Beli_Kendaraan',
    category: 'Transaksi Aset',
    name: 'Akta Jual Beli Kendaraan',
    description: 'Akta jual beli kendaraan bermotor',
  },
  {
    aktaType: 'Perjanjian_Kredit',
    category: 'Perjanjian',
    name: 'Perjanjian Kredit',
    description: 'Perjanjian pemberian kredit/pinjaman',
  },
  {
    aktaType: 'Perjanjian_Sewa',
    category: 'Perjanjian',
    name: 'Perjanjian Sewa-Menyewa',
    description: 'Perjanjian sewa menyewa',
  },
  {
    aktaType: 'Perjanjian_Kerjasama',
    category: 'Perjanjian',
    name: 'Perjanjian Kerja Sama Bisnis',
    description: 'Perjanjian kerja sama bisnis',
  },
  {
    aktaType: 'Perjanjian_Pengakuan_Utang',
    category: 'Perjanjian',
    name: 'Perjanjian Pengakuan Utang',
    description: 'Perjanjian pengakuan utang',
  },
  {
    aktaType: 'Akta_Hak_Waris',
    category: 'Waris dan Hibah',
    name: 'Akta Hak Waris',
    description: 'Akta pembagian harta warisan',
  },
  {
    aktaType: 'Akta_Wasiat',
    category: 'Waris dan Hibah',
    name: 'Akta Wasiat',
    description: 'Akta pembuatan wasiat',
  },
  {
    aktaType: 'Akta_Hibah',
    category: 'Waris dan Hibah',
    name: 'Akta Hibah',
    description: 'Akta pemberian hibah',
  },
];

const fieldSets = {
  PT_Pendirian: [
    { name: 'companyName', label: 'Nama Perusahaan', type: 'text', required: true },
    { name: 'companyAddress', label: 'Alamat Kantor', type: 'textarea', required: true },
    { name: 'capital', label: 'Modal Dasar', type: 'text', required: true },
    { name: 'capitalWords', label: 'Modal Dasar (terbilang)', type: 'textarea', required: true },
    { name: 'directorName', label: 'Nama Direktur', type: 'text', required: true },
    { name: 'directorBirthPlace', label: 'Tempat Lahir Direktur', type: 'text', required: true },
    { name: 'directorBirthDate', label: 'Tanggal Lahir Direktur', type: 'date', required: true },
    { name: 'directorOccupation', label: 'Pekerjaan Direktur', type: 'text', required: true },
    { name: 'directorAddress', label: 'Alamat Direktur', type: 'textarea', required: true },
    { name: 'shareholders', label: 'Pemegang Saham', type: 'textarea', required: true },
    { name: 'commissioners', label: 'Komisaris', type: 'text', required: false },
    { name: 'businessPurpose', label: 'Tujuan Usaha', type: 'textarea', required: true },
    { name: 'totalShares', label: 'Jumlah Saham', type: 'text', required: true },
    { name: 'shareValue', label: 'Nilai Per Saham', type: 'text', required: true },
    { name: 'shareValueWords', label: 'Nilai Per Saham (terbilang)', type: 'text', required: true },
    { name: 'approvedCapital', label: 'Modal Diperbolehkan', type: 'text', required: true },
    { name: 'approvedCapitalWords', label: 'Modal Diperbolehkan (terbilang)', type: 'text', required: true },
    { name: 'companyDuration', label: 'Lama Waktu Perseroan (tahun)', type: 'text', required: true },
    { name: 'termLength', label: 'Masa Jabatan Direktur/Komisaris', type: 'text', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  PT_Perubahan: [
    { name: 'companyName', label: 'Nama Perusahaan', type: 'text', required: true },
    { name: 'companyAddress', label: 'Alamat Kantor', type: 'textarea', required: true },
    { name: 'directorName', label: 'Nama Direktur', type: 'text', required: true },
    { name: 'changeType', label: 'Jenis Perubahan', type: 'text', required: true },
    { name: 'oldProvision', label: 'Ketentuan Lama', type: 'textarea', required: true },
    { name: 'newProvision', label: 'Ketentuan Baru', type: 'textarea', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Yayasan_Pendirian: [
    { name: 'foundationName', label: 'Nama Yayasan', type: 'text', required: true },
    { name: 'foundationAddress', label: 'Alamat Yayasan', type: 'textarea', required: true },
    { name: 'founderName', label: 'Nama Pendiri', type: 'text', required: true },
    { name: 'founderAddress', label: 'Alamat Pendiri', type: 'textarea', required: true },
    { name: 'purpose', label: 'Tujuan Yayasan', type: 'textarea', required: true },
    { name: 'initialAssets', label: 'Kekayaan Awal', type: 'text', required: true },
    { name: 'initialAssetsWords', label: 'Kekayaan Awal (terbilang)', type: 'textarea', required: true },
    { name: 'boardMembers', label: 'Anggota Pembina', type: 'textarea', required: true },
    { name: 'managementBoard', label: 'Anggota Pengurus', type: 'textarea', required: true },
    { name: 'termLength', label: 'Masa Jabatan (tahun)', type: 'text', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Yayasan_Perubahan: [
    { name: 'foundationName', label: 'Nama Yayasan', type: 'text', required: true },
    { name: 'boardChairName', label: 'Nama Ketua Pembina', type: 'text', required: true },
    { name: 'changeType', label: 'Jenis Perubahan', type: 'text', required: true },
    { name: 'oldProvision', label: 'Ketentuan Lama', type: 'textarea', required: true },
    { name: 'newProvision', label: 'Ketentuan Baru', type: 'textarea', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  CV_Pendirian: [
    { name: 'cvName', label: 'Nama CV', type: 'text', required: true },
    { name: 'cvAddress', label: 'Alamat CV', type: 'textarea', required: true },
    { name: 'generalPartner1Name', label: 'Nama Sekutu Pengurus', type: 'text', required: true },
    { name: 'generalPartner1Address', label: 'Alamat Sekutu Pengurus', type: 'textarea', required: true },
    { name: 'limitedPartner1Name', label: 'Nama Sekutu Komanditer', type: 'text', required: true },
    { name: 'limitedPartner1Address', label: 'Alamat Sekutu Komanditer', type: 'textarea', required: true },
    { name: 'generalPartners', label: 'Daftar Sekutu Pengurus', type: 'textarea', required: true },
    { name: 'limitedPartners', label: 'Daftar Sekutu Komanditer', type: 'textarea', required: true },
    { name: 'capital', label: 'Modal', type: 'text', required: true },
    { name: 'capitalWords', label: 'Modal (terbilang)', type: 'textarea', required: true },
    { name: 'generalPartnerCapital', label: 'Modal Sekutu Pengurus', type: 'text', required: true },
    { name: 'limitedPartnerCapital', label: 'Modal Sekutu Komanditer', type: 'text', required: true },
    { name: 'businessPurpose', label: 'Tujuan Usaha', type: 'textarea', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  CV_Perubahan: [
    { name: 'cvName', label: 'Nama CV', type: 'text', required: true },
    { name: 'generalPartnerName', label: 'Nama Sekutu Pengurus', type: 'text', required: true },
    { name: 'changeType', label: 'Jenis Perubahan', type: 'text', required: true },
    { name: 'oldProvision', label: 'Ketentuan Lama', type: 'textarea', required: true },
    { name: 'newProvision', label: 'Ketentuan Baru', type: 'textarea', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Koperasi_Pendirian: [
    { name: 'coopName', label: 'Nama Koperasi', type: 'text', required: true },
    { name: 'coopAddress', label: 'Alamat Koperasi', type: 'textarea', required: true },
    { name: 'founderName', label: 'Nama Pendiri', type: 'text', required: true },
    { name: 'founderAddress', label: 'Alamat Pendiri', type: 'textarea', required: true },
    { name: 'founders', label: 'Daftar Pendiri', type: 'textarea', required: true },
    { name: 'capital', label: 'Modal Awal', type: 'text', required: true },
    { name: 'capitalWords', label: 'Modal Awal (terbilang)', type: 'textarea', required: true },
    { name: 'purpose', label: 'Tujuan Koperasi', type: 'textarea', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Koperasi_Perubahan: [
    { name: 'coopName', label: 'Nama Koperasi', type: 'text', required: true },
    { name: 'chairmanName', label: 'Nama Ketua Pengurus', type: 'text', required: true },
    { name: 'changeType', label: 'Jenis Perubahan', type: 'text', required: true },
    { name: 'oldProvision', label: 'Ketentuan Lama', type: 'textarea', required: true },
    { name: 'newProvision', label: 'Ketentuan Baru', type: 'textarea', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Jual_Beli_Tanah: [
    { name: 'sellerName', label: 'Nama Penjual', type: 'text', required: true },
    { name: 'sellerAddress', label: 'Alamat Penjual', type: 'textarea', required: true },
    { name: 'buyerName', label: 'Nama Pembeli', type: 'text', required: true },
    { name: 'buyerAddress', label: 'Alamat Pembeli', type: 'textarea', required: true },
    { name: 'landLocation', label: 'Lokasi Tanah', type: 'textarea', required: true },
    { name: 'landArea', label: 'Luas Tanah (m\u00B2)', type: 'text', required: true },
    { name: 'landCertificate', label: 'Nomor Sertifikat', type: 'text', required: true },
    { name: 'certificateHolder', label: 'Nama Pemegang Sertifikat', type: 'text', required: true },
    { name: 'price', label: 'Harga Jual Beli', type: 'text', required: true },
    { name: 'priceWords', label: 'Harga (terbilang)', type: 'textarea', required: true },
    { name: 'paymentMethod', label: 'Cara Pembayaran', type: 'text', required: true },
    { name: 'bphtbBurden', label: 'Beban BPHTB', type: 'text', required: true },
    { name: 'pphBurden', label: 'Beban PPh', type: 'text', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Jual_Beli_Properti: [
    { name: 'sellerName', label: 'Nama Penjual', type: 'text', required: true },
    { name: 'sellerAddress', label: 'Alamat Penjual', type: 'textarea', required: true },
    { name: 'buyerName', label: 'Nama Pembeli', type: 'text', required: true },
    { name: 'buyerAddress', label: 'Alamat Pembeli', type: 'textarea', required: true },
    { name: 'propertyLocation', label: 'Lokasi Properti', type: 'textarea', required: true },
    { name: 'propertyType', label: 'Jenis Properti', type: 'text', required: true },
    { name: 'buildingArea', label: 'Luas Bangunan (m\u00B2)', type: 'text', required: true },
    { name: 'landArea', label: 'Luas Tanah (m\u00B2)', type: 'text', required: true },
    { name: 'certificateNumber', label: 'Nomor Sertifikat', type: 'text', required: true },
    { name: 'price', label: 'Harga Jual Beli', type: 'text', required: true },
    { name: 'priceWords', label: 'Harga (terbilang)', type: 'textarea', required: true },
    { name: 'paymentMethod', label: 'Cara Pembayaran', type: 'text', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Jual_Beli_Kendaraan: [
    { name: 'sellerName', label: 'Nama Penjual', type: 'text', required: true },
    { name: 'sellerAddress', label: 'Alamat Penjual', type: 'textarea', required: true },
    { name: 'buyerName', label: 'Nama Pembeli', type: 'text', required: true },
    { name: 'buyerAddress', label: 'Alamat Pembeli', type: 'textarea', required: true },
    { name: 'vehicleType', label: 'Jenis Kendaraan', type: 'text', required: true },
    { name: 'vehicleBrand', label: 'Merk Kendaraan', type: 'text', required: true },
    { name: 'vehicleModel', label: 'Type/Model', type: 'text', required: true },
    { name: 'vehicleYear', label: 'Tahun Pembuatan', type: 'text', required: true },
    { name: 'vehicleNumber', label: 'Nomor Polisi', type: 'text', required: true },
    { name: 'chassisNumber', label: 'Nomor Rangka', type: 'text', required: true },
    { name: 'engineNumber', label: 'Nomor Mesin', type: 'text', required: true },
    { name: 'vehicleColor', label: 'Warna Kendaraan', type: 'text', required: true },
    { name: 'fuelType', label: 'Jenis Bahan Bakar', type: 'text', required: true },
    { name: 'price', label: 'Harga Jual Beli', type: 'text', required: true },
    { name: 'priceWords', label: 'Harga (terbilang)', type: 'textarea', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Perjanjian_Kredit: [
    { name: 'creditorName', label: 'Nama Pemberi Kredit', type: 'text', required: true },
    { name: 'creditorAddress', label: 'Alamat Pemberi Kredit', type: 'textarea', required: true },
    { name: 'debtorName', label: 'Nama Penerima Kredit', type: 'text', required: true },
    { name: 'debtorAddress', label: 'Alamat Penerima Kredit', type: 'textarea', required: true },
    { name: 'loanAmount', label: 'Jumlah Pinjaman', type: 'text', required: true },
    { name: 'loanAmountWords', label: 'Jumlah Pinjaman (terbilang)', type: 'textarea', required: true },
    { name: 'loanType', label: 'Jenis Kredit', type: 'text', required: true },
    { name: 'interestRate', label: 'Suku Bunga', type: 'text', required: true },
    { name: 'loanTerm', label: 'Jangka Waktu', type: 'text', required: true },
    { name: 'repaymentDeadline', label: 'Tanggal Jatuh Tempo', type: 'date', required: true },
    { name: 'repaymentSchedule', label: 'Jadwal Pembayaran', type: 'textarea', required: true },
    { name: 'collateral', label: 'Jaminan', type: 'textarea', required: false },
    { name: 'lateFee', label: 'Denda Keterlambatan', type: 'text', required: false },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Perjanjian_Sewa: [
    { name: 'lessorName', label: 'Nama Pihak Menyewakan', type: 'text', required: true },
    { name: 'lessorAddress', label: 'Alamat Pihak Menyewakan', type: 'textarea', required: true },
    { name: 'lesseeName', label: 'Nama Pihak Penyewa', type: 'text', required: true },
    { name: 'lesseeAddress', label: 'Alamat Pihak Penyewa', type: 'textarea', required: true },
    { name: 'objectLeased', label: 'Objek yang Disewakan', type: 'textarea', required: true },
    { name: 'leasePeriod', label: 'Jangka Waktu Sewa', type: 'text', required: true },
    { name: 'leaseStart', label: 'Tanggal Mulai', type: 'date', required: true },
    { name: 'leaseEnd', label: 'Tanggal Berakhir', type: 'date', required: true },
    { name: 'rentAmount', label: 'Jumlah Sewa', type: 'text', required: true },
    { name: 'rentAmountWords', label: 'Jumlah Sewa (terbilang)', type: 'textarea', required: true },
    { name: 'paymentSchedule', label: 'Jadwal Pembayaran', type: 'text', required: true },
    { name: 'paymentMethod', label: 'Cara Pembayaran', type: 'text', required: true },
    { name: 'deposit', label: 'Uang Jaminan', type: 'text', required: false },
    { name: 'lesseeObligations', label: 'Kewajiban Penyewa', type: 'textarea', required: false },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Perjanjian_Kerjasama: [
    { name: 'partyAName', label: 'Nama Pihak Pertama', type: 'text', required: true },
    { name: 'partyAAddress', label: 'Alamat Pihak Pertama', type: 'textarea', required: true },
    { name: 'partyBName', label: 'Nama Pihak Kedua', type: 'text', required: true },
    { name: 'partyBAddress', label: 'Alamat Pihak Kedua', type: 'textarea', required: true },
    { name: 'cooperationType', label: 'Jenis Kerja Sama', type: 'text', required: true },
    { name: 'cooperationScope', label: 'Ruang Lingkup', type: 'textarea', required: true },
    { name: 'profitSharing', label: 'Pembagian Keuntungan', type: 'textarea', required: true },
    { name: 'duration', label: 'Jangka Waktu', type: 'text', required: true },
    { name: 'responsibilities', label: 'Kewajiban Masing-masing Pihak', type: 'textarea', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Perjanjian_Pengakuan_Utang: [
    { name: 'creditorName', label: 'Nama Kreditor', type: 'text', required: true },
    { name: 'creditorAddress', label: 'Alamat Kreditor', type: 'textarea', required: true },
    { name: 'debtorName', label: 'Nama Debitor', type: 'text', required: true },
    { name: 'debtorAddress', label: 'Alamat Debitor', type: 'textarea', required: true },
    { name: 'debtAmount', label: 'Jumlah Utang', type: 'text', required: true },
    { name: 'debtAmountWords', label: 'Jumlah Utang (terbilang)', type: 'textarea', required: true },
    { name: 'debtOrigin', label: 'Asal Usul Utang', type: 'textarea', required: true },
    { name: 'repaymentDate', label: 'Tanggal Jatuh Tempo', type: 'date', required: true },
    { name: 'collateral', label: 'Jaminan', type: 'textarea', required: false },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Akta_Hak_Waris: [
    { name: 'deceasedName', label: 'Nama Almarhum/Almarhumah', type: 'text', required: true },
    { name: 'deceasedDate', label: 'Tanggal Meninggal', type: 'date', required: true },
    { name: 'deceasedPlace', label: 'Tempat Meninggal', type: 'text', required: true },
    { name: 'heir1Name', label: 'Nama Ahli Waris (Utama)', type: 'text', required: true },
    { name: 'heir1Address', label: 'Alamat Ahli Waris', type: 'textarea', required: true },
    { name: 'heirs', label: 'Daftar Ahli Waris', type: 'textarea', required: true },
    { name: 'inheritedAssets', label: 'Harta Warisan', type: 'textarea', required: true },
    { name: 'distribution', label: 'Pembagian Warisan', type: 'textarea', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Akta_Wasiat: [
    { name: 'testatorName', label: 'Nama Pewasiat', type: 'text', required: true },
    { name: 'testatorBirthPlace', label: 'Tempat Lahir Pewasiat', type: 'text', required: true },
    { name: 'testatorBirthDate', label: 'Tanggal Lahir Pewasiat', type: 'date', required: true },
    { name: 'testatorOccupation', label: 'Pekerjaan Pewasiat', type: 'text', required: true },
    { name: 'testatorAddress', label: 'Alamat Pewasiat', type: 'textarea', required: true },
    { name: 'beneficiaries', label: 'Penerima Wasiat', type: 'textarea', required: true },
    { name: 'bequeathedAssets', label: 'Harta yang Diwasiatkan', type: 'textarea', required: true },
    { name: 'conditions', label: 'Syarat-syarat Wasiat', type: 'textarea', required: false },
    { name: 'executor', label: 'Pelaksana Wasiat', type: 'text', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
  Akta_Hibah: [
    { name: 'donorName', label: 'Nama Pemberi Hibah', type: 'text', required: true },
    { name: 'donorAddress', label: 'Alamat Pemberi Hibah', type: 'textarea', required: true },
    { name: 'doneeName', label: 'Nama Penerima Hibah', type: 'text', required: true },
    { name: 'doneeAddress', label: 'Alamat Penerima Hibah', type: 'textarea', required: true },
    { name: 'giftedAssets', label: 'Harta yang Dihibahkan', type: 'textarea', required: true },
    { name: 'assetValue', label: 'Nilai Harta', type: 'text', required: true },
    { name: 'assetValueWords', label: 'Nilai Harta (terbilang)', type: 'textarea', required: true },
    { name: 'conditions', label: 'Syarat-syarat Hibah', type: 'textarea', required: false },
    { name: 'taxBurden', label: 'Beban Pajak', type: 'text', required: true },
    { name: 'signingDate', label: 'Tanggal Penandatanganan', type: 'date', required: true },
    { name: 'signingCity', label: 'Kota Penandatanganan', type: 'text', required: true },
  ],
};

export async function runSeed(database) {
  const db = database;
  console.log('Seeding database...\n');

  const existingTemplates = await db.query.aktaTemplates.findMany();
  if (existingTemplates.length > 0) {
    console.log(`Found ${existingTemplates.length} existing templates. Skipping seed.`);
    console.log('To re-seed, delete existing templates first or truncate the tables.\n');
  } else {
    for (const tmpl of templatesToSeed) {
      const fields = fieldSets[tmpl.aktaType] || [];
      const templateId = crypto.randomUUID();

      const stages = (tmpl.aktaType.includes('PT_Pendirian') ?
        ['Pengecekan Nama PT', 'Penyusunan Akta', 'Penandatanganan Akta', 'Pengajuan SK Kemenkumham', 'Penerbitan SK', 'Selesai'] :
        tmpl.aktaType.includes('PT_Perubahan') ?
        ['Rapat Umum Pemegang Saham', 'Penyusunan Akta Perubahan', 'Penandatanganan Akta', 'Pengajuan ke Kemenkumham', 'Penerbitan SK Perubahan', 'Selesai'] :
        tmpl.aktaType.includes('Yayasan_Pendirian') ?
        ['Pengecekan Nama Yayasan', 'Penyusunan Akta', 'Penandatanganan Akta', 'Pengajuan SK Kemenkumham', 'Penerbitan SK', 'Selesai'] :
        tmpl.aktaType.includes('Yayasan_Perubahan') ?
        ['Rapat Pembina', 'Penyusunan Akta Perubahan', 'Penandatanganan Akta', 'Pengajuan ke Kemenkumham', 'Penerbitan SK Perubahan', 'Selesai'] :
        tmpl.aktaType.includes('CV_Pendirian') ?
        ['Penyusunan Akta', 'Penandatanganan Akta', 'Pendaftaran ke Kemenkumham', 'Penerbitan SK', 'Selesai'] :
        tmpl.aktaType.includes('CV_Perubahan') ?
        ['Musyawarah Sekutu', 'Penyusunan Akta Perubahan', 'Penandatanganan Akta', 'Pengajuan ke Kemenkumham', 'Penerbitan SK Perubahan', 'Selesai'] :
        tmpl.aktaType.includes('Koperasi_Pendirian') ?
        ['Rapat Pendirian', 'Penyusunan Akta', 'Penandatanganan Akta', 'Pengajuan ke Dinas Koperasi', 'Penerbitan SK', 'Selesai'] :
        tmpl.aktaType.includes('Koperasi_Perubahan') ?
        ['Rapat Anggota', 'Penyusunan Akta Perubahan', 'Penandatanganan Akta', 'Pengajuan ke Dinas Koperasi', 'Penerbitan SK Perubahan', 'Selesai'] :
        tmpl.aktaType.includes('Jual_Beli_Tanah') ?
        ['Verifikasi Dokumen Tanah', 'Cek Sertifikat di BPN', 'Penyusunan Akta', 'Penandatanganan Akta', 'Pembayaran BPHTB', 'Pendaftaran ke BPN', 'Selesai'] :
        tmpl.aktaType.includes('Jual_Beli_Properti') ?
        ['Verifikasi Dokumen Properti', 'Cek Sertifikat di BPN', 'Penyusunan Akta', 'Penandatanganan Akta', 'Pembayaran BPHTB', 'Pendaftaran ke BPN', 'Selesai'] :
        tmpl.aktaType.includes('Jual_Beli_Kendaraan') ?
        ['Verifikasi Dokumen Kendaraan', 'Cek BPKB', 'Penyusunan Akta', 'Penandatanganan Akta', 'Balik Nama di Samsat', 'Selesai'] :
        tmpl.aktaType.includes('Perjanjian_Kredit') ?
        ['Negosiasi Syarat Kredit', 'Penyusunan Perjanjian', 'Review Hukum', 'Penandatanganan Perjanjian', 'Pencairan Kredit', 'Selesai'] :
        tmpl.aktaType.includes('Perjanjian_Sewa') ?
        ['Negosiasi Syarat Sewa', 'Penyusunan Perjanjian', 'Review Hukum', 'Penandatanganan Perjanjian', 'Serah Terima Objek', 'Selesai'] :
        tmpl.aktaType.includes('Perjanjian_Kerjasama') ?
        ['Negosiasi Kerja Sama', 'Penyusunan Perjanjian', 'Review Hukum', 'Penandatanganan Perjanjian', 'Implementasi Kerja Sama', 'Selesai'] :
        tmpl.aktaType.includes('Perjanjian_Pengakuan_Utang') ?
        ['Verifikasi Utang', 'Penyusunan Perjanjian', 'Review Hukum', 'Penandatanganan Perjanjian', 'Selesai'] :
        tmpl.aktaType.includes('Akta_Hak_Waris') ?
        ['Verifikasi Dokumen Kematian', 'Pendataan Ahli Waris', 'Inventarisasi Harta Warisan', 'Penyusunan Akta', 'Penandatanganan Akta', 'Selesai'] :
        tmpl.aktaType.includes('Akta_Wasiat') ?
        ['Konsultasi dengan Pewasiat', 'Penyusunan Akta Wasiat', 'Penandatanganan Akta', 'Pendaftaran di Pusat Daftar Wasiat', 'Selesai'] :
        ['Verifikasi Dokumen', 'Penyusunan Akta Hibah', 'Penandatanganan Akta', 'Pembayaran Bea Perolehan', 'Peralihan Hak', 'Selesai']
      ).map((name, index) => ({
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
        name,
        order: index
      }));

      await db.insert(aktaTemplates).values({
        id: templateId,
        name: tmpl.name,
        aktaType: tmpl.aktaType,
        category: tmpl.category,
        description: tmpl.description,
        content: '',
        stages,
        version: 1,
      });

      const fieldValues = fields.map((field, index) => ({
        id: crypto.randomUUID(),
        templateId,
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options || null,
        placeholder: null,
        validation: null,
        order: index,
      }));

      await db.insert(templateFields).values(fieldValues);
      console.log(`  Seeded: ${tmpl.name} (${fields.length} fields)`);
    }
  }

  const existingUsers = await db.query.users.findMany();
  if (existingUsers.length === 0) {
    const password = process.env.SEED_PASSWORD || 'password123';
    const hashedPassword = await hashPassword(password);

    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: 'admin@notaris.com',
      name: 'Super Admin',
      passwordHash: hashedPassword,
      role: 'super_admin',
    });

    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: 'staff@notaris.com',
      name: 'Staff Admin',
      passwordHash: hashedPassword,
      role: 'admin',
    });

    console.log(`  Created default admin users (password: ${password})`);
  } else {
    console.log(`  Found ${existingUsers.length} existing users. Skipping user seed.`);
  }

  console.log('\nSeeding completed!');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed(defaultDb).catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
