<template>
  <section :data-mode-uuid="mode.uuid" class="fixture-mode card">

    <a
      v-if="fixture.modes.length > 1"
      href="#remove-mode"
      class="icon-button close"
      @click.prevent="$emit(`remove`)">
      Remove mode
      <OflSvg name="close" />
    </a>

    <h2>Mode #{{ index + 1 }}</h2>

    <LabeledInput :formstate="formstate" :name="`mode-${index}-name`" label="Name">
      <PropertyInputText
        ref="firstInput"
        v-model="mode.name"
        :name="`mode-${index}-name`"
        :schema-property="schemaDefinitions.modeNameString.allOf[1]"
        required
        no-mode-name
        hint="e.g. Extended"
        title="The name must not contain the word 'mode'." />
    </LabeledInput>

    <LabeledInput :formstate="formstate" :name="`mode-${index}-shortName`" label="Unique short name">
      <PropertyInputText
        v-model="mode.shortName"
        :name="`mode-${index}-shortName`"
        :schema-property="schemaDefinitions.modeNameString.allOf[1]"
        no-mode-name
        hint="e.g. ext; defaults to name"
        title="The short name must not contain the word 'mode'." />
    </LabeledInput>

    <LabeledInput
      v-if="fixture.rdmModelId !== null"
      :formstate="formstate"
      :name="`mode-${index}-rdmPersonalityIndex`"
      label="RDM personality index">
      <PropertyInputNumber
        v-model="mode.rdmPersonalityIndex"
        :name="`mode-${index}-rdmPersonalityIndex`"
        :schema-property="modeProperties.rdmPersonalityIndex" />
    </LabeledInput>


    <h3>Physical override</h3>

    <label>
      <input
        v-model="mode.enablePhysicalOverride"
        type="checkbox"
        class="enable-physical-override">
      Override fixture's physical data in this mode
    </label>

    <section class="physical-override">
      <EditorPhysical
        v-if="mode.enablePhysicalOverride"
        v-model="mode.physical"
        :formstate="formstate"
        :name-prefix="`mode-${index}`" />
    </section>


    <h3>DMX channels</h3>

    <Validate
      :state="formstate"
      :custom="{ 'no-empty-channel-list': channelListNotEmpty }"
      tag="div"
      class="mode-channels">
      <input v-model="mode.channels" :name="`mode-${index}-channels`" type="hidden">
      <Draggable :list="mode.channels" v-bind="dragOptions">
        <TransitionGroup class="mode-channels" tag="ol">
          <li
            v-for="channelUuid of mode.channels"
            :key="channelUuid"
            :data-channel-uuid="channelUuid">

            <span class="channel-name">{{ getChannelName(channelUuid) }}</span>

            <code v-if="!isChannelNameUnique(channelUuid)" class="channel-uuid"> {{ channelUuid }}</code>

            <span class="channel-buttons">
              <a
                href="#move"
                title="Drag to change channel order"
                class="drag-handle"
                @click.prevent>
                <OflSvg name="move" />
              </a>

              <a
                v-if="!isFineChannel(channelUuid)"
                href="#channel-editor"
                title="Edit channel"
                @click.prevent="editChannel(channelUuid)">
                <OflSvg name="pencil" />
              </a>

              <a
                href="#remove"
                title="Remove channel"
                @click.prevent="removeChannel(channelUuid)">
                <OflSvg name="close" />
              </a>
            </span>

          </li>
        </TransitionGroup>
      </Draggable>
      <FieldMessages
        :state="formstate"
        :name="`mode-${index}-channels`"
        show="$submitted"
        tag="div"
        class="error-message">
        <template #no-empty-channel-list>
          <div>A mode must contain at least one channel.</div>
        </template>
      </FieldMessages>
    </Validate>

    <a href="#add-channel" class="button primary" @click.prevent="addChannel()">add channel</a>

  </section>
</template>

<style lang="scss" scoped>
.fixture-mode ::v-deep section {
  flex-direction: column;

  & > .label {
    flex-basis: auto;
  }
}

.mode-channels {
  padding-top: 4px;
  padding-bottom: 4px;
  margin: 0 0 1ex;

  & li {
    position: relative;
  }

  & a:focus {
    opacity: 1;
  }

  & .channel-buttons {
    position: absolute;
    top: 0;
    right: 0;
    background-color: theme-color(card-background, 0%);
    transition: background-color 0.1s, box-shadow 0.1s;

    & a {
      padding: 0.3em;
      opacity: 0;
      transition: opacity 0.1s;
    }
  }

  // has to be a separate rule because older browsers would ignore the whole rule
  & .channel-buttons:focus-within {
    background-color: theme-color(card-background);
    box-shadow: -1ex 0 1ex 0.5ex theme-color(card-background);

    & a {
      opacity: 1;
    }
  }

  & li:hover .channel-buttons,
  & li.sortable-chosen .channel-buttons,
  & li.sortable-ghost .channel-buttons {
    background-color: theme-color(card-background);
    box-shadow: -1ex 0 1ex 0.5ex theme-color(card-background);

    & a {
      opacity: 1;
    }
  }

  & .drag-handle {
    cursor: move;
  }
}
</style>


<script>
import Draggable from 'vuedraggable';

import { schemaDefinitions, modeProperties } from '../../../lib/schema-properties.js';
import { constants } from '../../assets/scripts/editor-utils.js';

import LabeledInput from '../LabeledInput.vue';
import PropertyInputNumber from '../PropertyInputNumber.vue';
import PropertyInputText from '../PropertyInputText.vue';
import EditorPhysical from './EditorPhysical.vue';

export default {
  components: {
    Draggable,
    EditorPhysical,
    LabeledInput,
    PropertyInputNumber,
    PropertyInputText,
  },
  model: {
    prop: `mode`,
  },
  props: {
    mode: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    fixture: {
      type: Object,
      required: true,
    },
    formstate: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      schemaDefinitions,
      modeProperties,
      dragOptions: {
        handle: `.drag-handle`,
        group: {
          name: `mode`,
          pull: `clone`,
          put: (to, from, dragElement, event) => {
            if (from === to) {
              return false;
            }

            const channelUuid = dragElement.getAttribute(`data-channel-uuid`);
            const modeUuid = to.el.closest(`.fixture-mode`).getAttribute(`data-mode-uuid`);
            const targetMode = this.fixture.modes.find(mode => mode.uuid === modeUuid);

            if (targetMode.channels.includes(channelUuid)) {
              // channel already in target mode
              return false;
            }

            const channel = this.fixture.availableChannels[channelUuid];
            if (!(`coarseChannelId` in channel)) {
              // normal channels don't need any more validation
              return true;
            }

            if (!targetMode.channels.includes(channel.coarseChannelId)) {
              // fine channels need their coarse channel
              return false;
            }

            if (channel.resolution === constants.RESOLUTION_16BIT) {
              // next coarser channel is coarse channel, which is in target mode
              return true;
            }

            // return whether next coarser channel can be found in target mode
            return targetMode.channels.some(uuid => {
              const otherChannel = this.fixture.availableChannels[uuid];
              return otherChannel.coarseChannelId === channel.coarseChannelId && otherChannel.resolution === channel.resolution - 1;
            });
          },
          revertClone: true,
        },
      },
    };
  },
  computed: {
    fixtureEditor() {
      const vueForm = this.$parent;
      return vueForm.$parent;
    },
    channelListNotEmpty() {
      return this.mode.channels.length > 0;
    },
  },
  mounted() {
    if (this.$root._oflRestoreComplete) {
      this.$refs.firstInput.focus();
    }
  },
  methods: {
    getChannelName(channelUuid) {
      return this.fixtureEditor.getChannelName(channelUuid);
    },
    editChannel(channelUuid) {
      this.$emit(`open-channel-editor`, {
        modeId: this.mode.uuid,
        editMode: `edit-?`,
        uuid: channelUuid,
      });
    },
    addChannel() {
      this.$emit(`open-channel-editor`, {
        modeId: this.mode.uuid,
        editMode: `add-existing`,
      });
    },
    isChannelNameUnique(channelUuid) {
      return this.fixtureEditor.isChannelNameUnique(channelUuid);
    },
    isFineChannel(channelUuid) {
      return `coarseChannelId` in this.fixture.availableChannels[channelUuid];
    },
    removeChannel(channelUuid) {
      const channel = this.fixture.availableChannels[channelUuid];

      // first remove the finer channels if any
      let coarseChannelId = channelUuid;
      let resolution = constants.RESOLUTION_8BIT;
      if (this.isFineChannel(channelUuid)) {
        coarseChannelId = channel.coarseChannelId;
        resolution = channel.resolution;
      }

      for (const otherChannel of Object.values(this.fixture.availableChannels)) {
        if (otherChannel.coarseChannelId === coarseChannelId && otherChannel.resolution > resolution) {
          this.fixtureEditor.removeChannel(otherChannel.uuid, this.mode.uuid);
        }
      }

      // then remove the channel itself
      this.fixtureEditor.removeChannel(channelUuid, this.mode.uuid);
    },
  },
};
</script>
