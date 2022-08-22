<script setup>
import { storeToRefs } from 'pinia/dist/pinia'
import { useApiStore } from '../stores/api'
import { useReservationStore } from '../stores/reservation'

const { logoutUrl } = storeToRefs(useApiStore())
const { acknowledgeComplete } = useReservationStore()

</script>

<template>
  <section class="galc-confirmation-dialog" role="alertdialog" aria-modal="true" aria-labelledby="galc-dialog-title" aria-describedby="galc-confirmation-message">
    <h2 id="galc-dialog-title">Confirmation</h2>
    <div id="galc-confirmation-message">
      <p>Thank you for submitting a Graphic Arts Loan Collection print reservation request.</p>
      <ul>
        <li>
          If you have not already done so, please read and submit the online
          <a href="https://framework.lib.berkeley.edu/forms/galc-agreement/new">Borrowing
            Agreement</a>.
          <strong>You must submit the Borrowing Agreement before you pick up your
            print.</strong>
        </li>
        <li>
          The Morrison Library will email you when your print is ready for pick up.
        </li>
        <li>
          <strong>You may only reserve two prints per semester. You may have no more than
            two prints charged out at any time.</strong>
        </li>
        <li>
          Prints will be available for pick up at the Morrison Library during regular
          business hours, Monday-Friday, 10am-5pm.
        </li>
        <li>
          When you pick up a print, you must show your current UC Berkeley ID.
        </li>
        <li>
          Prints are non-renewable. All prints must be returned by the spring semester due date.
          Please handle with care. We suggest keeping the cardboard corners and reusing them when
          returning the prints.
        </li>
      </ul>
      <p>When you are done reserving prints, remember to log out of CalNet via the link provided.</p>
    </div>
    <div class="galc-confirmation-actions">
      <button class="galc-confirmation-close" @click="acknowledgeComplete">Close</button>
      <a class="galc-confirmation-logout" :href="logoutUrl">Close and Log Out</a>
    </div>
  </section>
</template>

<style lang="scss">
.galc-confirmation-dialog {
  padding: 2em;
  border: 1px solid black;
  background-color: white;
  max-width: 1075px;

  .galc-confirmation-actions {
    display: flex;
    justify-content: center;
    gap: 1em;

    // TODO: share button styles
    button, a {
      width: 180px;
      white-space: nowrap;
      text-transform: uppercase;
      font-weight: 700;
      height: 42px;
      padding: 6px 10px;
      transition: background-color .25s, color .25s, border .25s;
      color: #000;
      font-size: 1rem;

      &.galc-confirmation-close {
        background-color: white;
        border: 1px solid black;

        &:hover {
          background-color: #000;
          color: #fff;
        }
      }

      &.galc-confirmation-logout {
        background-color: #fdb515;
        border: 1px solid #fdb515;

        &:hover {
          border-color: black;
          background-color: #000;
          color: #fff;
        }
      }
    }

    a {
      box-shadow: none;
      text-align: center;
      text-decoration: none;
    }
  }
}
</style>
