/**
 * AddOn: runtime system
 * //System utilizing stream
 * //systems that undergo runtime commands and flow
 * //allowing each system to be controlled by runtime process through proxy stream
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _runtime = _struct.addon.runtime
    var That = _runtime.system = function () {
        var Pointer, Knob, Subject,
            Marquee, Grid, Parallax,
            Entity, Physic, Bound, Collision,
            Particle, Rig
        this.update = function () {
            return this
        }
        this.proxy = function () {
            return this
        }
        this.init = function () {
            return this
        }

        this.Pointer = function () {
            Pointer = That.pointer
            this.Pointer = new Pointer()

            return this
        }

        this.Knob = function () {
            Knob = That.knob
            this.Knob = new Knob()

            return this
        }

        this.Subject = function () {
            Subject = That.subject
            this.Subject = new Subject()

            return this
        }

        this.Marquee = function () {
            if (!Pointer && !Knob && !Subject) { console.log('System Marquee: No - Pointer, Knob or Subject detected'); return }
            Marquee = That.marquee
            this.Marquee = new Marquee()

            return this
        }

        this.Grid = function () {
            if (!Pointer && !Knob && !Subject) { console.log('System Grid: No - Pointer, Knob or Subject detected'); return }
            Grid = That.grid
            this.Grid = new Grid()

            return this
        }

        this.Parallax = function () {
            if (!Grid) { console.log('System Parallax: No - Grid system detected'); return }
            Parallax = this.Grid.parallax
            this.Parallax = new Parallax()

            return this
        }

        this.Entity = function () {
            if (!Parallax) { console.log('System Entity: No - Parallax system detected'); return }
            Entity = this.Parallax.entity
            this.Entity = new Entity()

            return this
        }

        this.Physic = function () {
            if (!Parallax) { console.log('System Physic: No - Parallax system detected'); return }
            Physic = this.Parallax.physic
            this.Physic = new Physic()

            return this
        }

        this.Bound = function () {
            if (!Parallax) { console.log('System Bound: No - Parallax system detected'); return }
            Bound = this.Parallax.bound
            this.Bound = new Bound()

            return this
        }

        this.Collision = function () {
            if (!Parallax) { console.log('System Collision: No - Parallax system detected'); return }
            Collision = this.Parallax.collision
            this.Collision = new Collision()

            return this
        }

        this.Particle = function () {
            if (!Entity && !Physic && !Bound && !Collision) { console.log('System Particle: No - Entity, Physic, Bound or Collision detected'); return }
            Particle = this.Parallax.particle
            this.Particle = new Particle()

            return this
        }

        this.Rig = function () {
            if (!Entity && !Physic && !Bound && !Collision) { console.log('System Rig: No - Entity, Physic, Bound or Collision detected'); return }
            Rig = this.Parallax.rig
            this.Rig = new Rig()

            return this
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
})(this.Streaming)
