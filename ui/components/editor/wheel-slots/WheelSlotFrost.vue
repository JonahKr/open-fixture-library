<template>
  <div class="wheel-slot-type-data">

    <LabeledInput
      :formstate="formstate"
      multiple-inputs
      :name="`wheel-slot${wheelSlot.uuid}-frostIntensity`"
      label="Frost intensity">
      <PropertyInputEntity
        v-model="wheelSlot.typeData.frostIntensity"
        :formstate="formstate"
        :name="`wheel-slot${wheelSlot.uuid}-frostIntensity`"
        :schema-property="entitiesSchema.percent" />
    </LabeledInput>

  </div>
</template>

<script>
import { entitiesSchema } from '../../../../lib/schema-properties.js';

import LabeledInput from '../../LabeledInput.vue';
import PropertyInputEntity from '../../PropertyInputEntity.vue';

export default {
  components: {
    LabeledInput,
    PropertyInputEntity,
  },
  props: {
    wheelSlot: {
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
      entitiesSchema,

      /**
       * Used in {@link EditorWheelSlot}
       * @public
       */
      defaultData: {
        frostIntensity: ``,
      },
    };
  },
};
</script>
