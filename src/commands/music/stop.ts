import Command, { sendMessage, deleteMessage } from '../command';
import { Message } from 'discord.js';
import * as YouTube from '../../utils/music';

const Stop: Command = {
  format: /^(?<command>(stop|parar))$/,
  execute: async (message: Message, params: { [key: string]: string }) => {
    try {
      if (!message.guild || !message.member) {
        return;
      }

      const musicChannel = await YouTube.isMusicChannel(message);
      if (!musicChannel[0]) {
        await message.delete();
        await deleteMessage(await sendMessage(message, `solo puedes usar comandos de música en ${musicChannel[1]}`, params.command));
        return;
      }

      if (!message.member.voice.channel) {
        await sendMessage(message, 'no estás en un canal de voz.', params.command);
        return;
      }

      let queue = YouTube.queues[message.guild.id];
      if (!queue || !queue.playing || !queue.playingDispatcher) {
        await sendMessage(message, 'no estoy reproduciendo música.', params.command);
        return;
      }

      if (!queue.voiceChannel.members.has(message.member.id)) {
        await sendMessage(message, 'no estás en el canal de voz.', params.command);
        return;
      }

      await YouTube.voteSystem(message, ['stop', params.command]);
    } catch (error) {
      console.error('Stop Command', error);
    }
  },
};

export default Stop;