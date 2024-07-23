<template>
  <main>
    <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 class="text-2xl font-bold mb-6">Confirmation de Paiement</h1>
      <div class="space-y-4">
        <p class="text-lg"><strong class="font-semibold">Nom :</strong> {{ paymentDetails.name }}</p>
        <p class="text-lg"><strong class="font-semibold">Montant :</strong> {{ formatAmount(paymentDetails.amount, paymentDetails.currency) }}</p>
        <p class="text-lg"><strong class="font-semibold">Date :</strong> {{ formatDate(paymentDetails.date) }}</p>
        <p class="text-lg"><strong class="font-semibold">ID de transaction :</strong> {{ paymentDetails.transactionId }}</p>
        <p class="text-lg text-green-600 font-semibold">Merci pour votre achat ! Votre paiement a été traité avec succès.</p>
      </div>
    </div>
  </main>
</template>
  