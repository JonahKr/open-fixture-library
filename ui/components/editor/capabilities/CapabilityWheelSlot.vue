<template>
  <div class="capability-type-data">

    <LabeledInput
      :formstate="formstate"
      multiple-inputs
      :name="`capability${capability.uuid}-slotNumber`"
      label="Slot number">
      <EditorProportionalPropertySwitcher
        :capability="capability"
        :formstate="formstate"
        required
        property-name="slotNumber" />
    </LabeledInput>

    <EditorWheelSlots
      :channel="channel"
      :capability="capability"
      :formstate="formstate" />

    <LabeledInput
      :formstate="formstate"
      :name="`capability${capability.uuid}-comment`"
      label="Comment">
      <PropertyInputText
        v-model="capability.typeData.comment"
        :formstate="formstate"
        :name="`capability${capability.uuid}-comment`"
        :schema-property="schemaDefinitions.nonEmptyString" />
    </LabeledInput>

  </div>
</template>

<script>
import { schemaDefinitions } from '../../../../lib/schema-properties.js';

import LabeledInput from '../../LabeledInput.vue';
import PropertyInputText from '../../PropertyInputText.vue';
import EditorProportionalPropertySwitcher from '../EditorProportionalPropertySwitcher.vue';
import EditorWheelSlots from '../EditorWheelSlots.vue';

export default {
  components: {
    EditorProportionalPropertySwitcher,
    EditorWheelSlots,
    LabeledInput,
    PropertyInputText,
  },
  props: {
    capability: {
      type: Object,
      required: true,
    },
    channel: {
      type: Object,
      required: true,
    },
    formstate: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      schemaDefinitions,

      /**
       * Used in {@link EditorCapabilityTypeData}
       * @public
       */
      defaultData: {
        slotNumber: ``,
        slotNumberStart: null,
        slotNumberEnd: null,
        comment: ``,
      },
    };
  },
};
</script>
